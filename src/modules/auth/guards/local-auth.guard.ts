import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
/*  tham số truyền vào cho AuthGuard sẽ khai báo strategy tương ứng
    AuthGuard sẽ tìm Strategy tương ứng đã khai báo (providers) trong module
    để uỷ quyền và trả về kết quả của Strategy đó */
export class LocalAuthGuard extends AuthGuard('local') {
  /* hàm handle request mặc định sẽ ném lỗi từ strategy
     nên override lại để nếu strategy không nhận ra lỗi sẽ 
     ném user sang cho controller, ở đó dto sẽ được gọi để validate */
  handleRequest(err: any, user: any, info: any) {
    if (err) {
      throw new BadRequestException('Login failed', {
        description: err.message,
      });
    }

    return user;
  }
}
