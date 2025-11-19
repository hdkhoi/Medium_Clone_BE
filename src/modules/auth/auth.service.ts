import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { UserEntity } from '../user/entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async signIn({ id, email }) {
    const accessToken = await this.jwtService.signAsync({
      id,
      email,
    });

    const user = await this.userService.findById(id);

    //plaintoinstance sẽ áp dụng decorator @Exclude và @Expose trong UserEntity với
    //object truyền vào mà object đó là instance của UserEntity
    const result = plainToInstance(UserEntity, { ...user, token: accessToken });

    return result;
  }
}
