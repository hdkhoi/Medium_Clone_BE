import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!user) {
      if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }

    return user;
  }
}
