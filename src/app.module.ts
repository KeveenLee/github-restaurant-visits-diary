import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConnectionModule } from './dbconnection/dbconnection.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { VisitModule } from './visit/visit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbConnectionModule,
    AuthModule,
    UserModule,
    RestaurantModule,
    VisitModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
