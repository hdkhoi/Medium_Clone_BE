import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { UserEntity } from '../user/entities/user.entity';

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

    return { ...(user as UserEntity), token: accessToken };
  }
}
