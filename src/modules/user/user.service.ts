import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Create user failed', {
        description: 'Email already in use',
      });
    }

    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Create user failed', {
        description: 'Username already in use',
      });
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);

    return {
      message: 'User created successfully',
      data: {
        id: savedUser.id,
        email: savedUser.email,
        username: savedUser.username,
      },
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findById(id: number) {
    const result = await this.userRepository.findOne({ where: { id } });
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
