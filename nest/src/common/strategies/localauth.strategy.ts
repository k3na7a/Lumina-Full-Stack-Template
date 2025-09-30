import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UserAccountService } from 'src/modules/users/services/users-account.service';

@Injectable()
class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private service: UserAccountService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    return this.service.validateUser(email, password);
  }
}

export { LocalStrategy };
