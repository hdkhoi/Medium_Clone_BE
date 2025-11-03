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
    const { email, username } = createUserDto;

    const emailExists = await this.checkEmailExists(email);
    if (emailExists) {
      throw new ConflictException('Đăng ký tài khoản không thành công', {
        description: 'Email đã được sử dụng',
      });
    }

    const usernameExists = await this.checkUsernameExists(username);
    if (usernameExists) {
      throw new ConflictException('Đăng ký tài khoản không thành công', {
        description: 'Username đã được sử dụng',
      });
    }

    const salt = 10;
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    console.log('Hashed password:', createUserDto.password);

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
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

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return !!user;
  }
}
