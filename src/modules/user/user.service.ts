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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return (await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)) as string;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;

    const checkUserExist = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (checkUserExist) {
      if (checkUserExist.email === email) {
        throw new ConflictException('Create user failed', {
          description: 'Email already in use',
        });
      }
      if (checkUserExist.username === username) {
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

  findAll() {
    return `This action returns all user`;
  }

  async findById(id: number) {
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

    return {
      message: 'User retrieved successfully',
      data: result,
    };
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }

  async checkPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
