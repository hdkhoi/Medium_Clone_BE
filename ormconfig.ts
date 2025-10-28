import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Tải các biến môi trường từ file .env

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'medium_admin',
  password: '',
  database: 'medium_clone_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'], // Thư mục chứa migrations
  migrationsTableName: 'migrations', // Tên bảng để theo dõi migrations đã chạy
});
