import { Role } from 'src/library/data/enums/role.enum';
import { AvatarEntity } from '../entities/avatar.entity';

export interface UpdateUserInterface {
  email?: string;
  password?: string;
  role?: Role;
  refreshToken?: string | null;
  resetToken?: string | null;
}

export interface CreateUserInterface {
  email: string;
  password: string;
  profile: CreateUserProfile;
}

export interface UpdateUserProfile {
  avatar?: AvatarEntity | null;
  name?: CreateUserName;
}

export interface CreateUserProfile {
  name: CreateUserName;
}

export interface CreateUserName {
  first: string;
  last: string;
}
