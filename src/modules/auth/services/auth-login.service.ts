import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../modules/user/repository/user.repository';
import { UserLoginDto } from '../dtos/user-login.dto';

@Injectable()
export class AuthLoginService {
  constructor(
    private userRepository: UserRepository,
    private jwt: JwtService,
  ) {}

  async execute({ email, password }: UserLoginDto) {
    const userExists = await this.userRepository.findOneByEmail(email);

    if (!userExists) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordIsValid = await bcrypt.compare(password, userExists.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    delete userExists.password;

    return {
      token: this.jwt.sign({ email }),
      userExists,
    };
  }
}
