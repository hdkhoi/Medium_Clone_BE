import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn({ id, email }) {
    const accessToken = await this.jwtService.signAsync({
      id,
      email,
    });
    return { accessToken, user: { id, email } };
  }
}
