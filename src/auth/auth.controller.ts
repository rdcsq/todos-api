import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/user.guard';
import { Request as ExpressRequest } from 'express';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const id = await this.accountsService.create(
      signUpDto.name,
      signUpDto.email,
    );
    await this.authService.setPassword(id, signUpDto.password);
    const accessToken = await this.authService.createSession(id);
    return { accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Request() req: ExpressRequest) {
    const account = this.accountsService.get(req.user as string);
    if (!account) throw new BadRequestException();
    return account;
  }

  @Post('/update-password')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Request() req: ExpressRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const updateSuccessful = await this.authService.updatePassword(
      req.user as string,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword,
    );

    if (!updateSuccessful) {
      throw new BadRequestException();
    }
  }
}
