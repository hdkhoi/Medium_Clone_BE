import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async signIn({ id, email }) {
    const accessToken = await this.jwtService.signAsync({
      id,
      email,
    });

    return {
      message: 'Login successfully',
      data: { accessToken, user: { id, email } },
    };
  }
}
