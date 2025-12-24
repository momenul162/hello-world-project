import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Credential } from './entities/credential.entity';
import { User } from '../user/user.entity';
import { UserCreatedListener } from 'src/listener/event-created.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credential, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') ?? '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, UserCreatedListener],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
