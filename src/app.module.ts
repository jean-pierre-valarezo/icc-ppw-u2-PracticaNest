import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './status/status.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/entities/users.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
 imports: [
    TypeOrmModule.forRoot({
       type: 'postgres',
      host: 'localhost',
      port: 5434,            
      username: 'ups',
      password: 'ups123',
      database: 'devdb-nest',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,       
      logging: true,
    }),
    StatusModule,
    AuthModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
