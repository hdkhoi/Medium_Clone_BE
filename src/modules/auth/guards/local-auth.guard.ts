import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//tham số truyền vào cho AuthGuard sẽ khai báo strategy tương ứng
//AuthGuard sẽ tìm Strategy tương ứng đã khai báo (providers) trong module
//để uỷ quyền và trả về kết quả của Strategy đó
export class LocalAuthGuard extends AuthGuard('local') {}
