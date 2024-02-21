import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AuthController } from './auth.controller';
import { ApiConfigModule } from 'src/api-config/api-config.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ApiConfigService } from 'src/api-config/api-config.service';

@Module({
  providers: [AuthService],
  imports: [
    AccountsModule,
    ApiConfigModule,
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory(apiConfigService: ApiConfigService) {
        return {
          secret: apiConfigService.jwtSecret,
        } satisfies JwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
