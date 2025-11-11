import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUNDS } from 'src/common/constants/user.constant';
import { JwtService } from '@nestjs/jwt';
import { IProfile, IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return (await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)) as string;
  }

  async checkExistUser(email?: string, username?: string) {
    const user = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    return user;
  }

  async checkPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;

    const existedUser = await this.checkExistUser(email, username);

    if (existedUser) {
      if (existedUser.email === email) {
        throw new ConflictException('Create user failed', {
          description: 'Email already in use',
        });
      }
      if (existedUser.username === username) {
        throw new ConflictException('Create user failed', {
          description: 'Username already in use',
        });
      }
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return {
      message: 'User created successfully',
      data: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    };
  }

  async findById(id: number): Promise<IUser> {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid user ID', {
        description: 'User ID must be a number',
      });
    }

    const result = await this.userRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('User not found', {
        description: `No user found with ID ${id}`,
      });
    }

    return result.getInfo();
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }

  async findByUsername(username: string): Promise<IProfile> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found', {
        description: `No user found with username ${username}`,
      });
    }

    return user.getProfile();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let newToken: string | undefined;

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExist = await this.checkExistUser(
        updateUserDto.email,
        undefined,
      );

      if (emailExist) {
        throw new ConflictException('Update failed', {
          description: 'Email already in use',
        });
      } else {
        newToken = await this.jwtService.signAsync({
          id,
          email: updateUserDto.email,
        });
      }
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const usernameExist = await this.checkExistUser(
        undefined,
        updateUserDto.username,
      );
      if (usernameExist) {
        throw new ConflictException('Update failed', {
          description: 'Username already in use',
        });
      }
    }

    // Cập nhật các field
    Object.assign(user, updateUserDto);

    if (updateUserDto.password) {
      user.password = await this.hashPassword(updateUserDto.password);
    }

    // PHẢI SAVE để lưu vào database
    const updatedUser = await this.userRepository.save(user);
    return {
      ...updatedUser?.getInfo(),
      ...(newToken && { token: newToken }),
    };
  }
}
