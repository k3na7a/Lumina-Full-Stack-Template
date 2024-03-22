// #region @imports
// NODE IMPORTS
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
// PROJECT IMPORTS
import { UserService } from '../services/users.service';
import { UserEntity } from '../entities/user.entity';
import { RefreshTokenGuard } from 'src/app/authentication/guards/refreshtoken.guard';
import { RefreshTokenRequest } from 'src/app/authentication/interfaces/refreshToken.interface';
// #endregion

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(RefreshTokenGuard)
  async getMe(@Request() req: RefreshTokenRequest): Promise<UserEntity> {
    return req.user.userEntity;
  }
}
