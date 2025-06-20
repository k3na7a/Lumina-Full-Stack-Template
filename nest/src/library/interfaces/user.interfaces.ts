import { Role } from 'src/library/enums/role.enum';
import { iImage } from './image.interfaces';
import { ImageEntity } from 'src/app/modules/media/entities/image.entity';

export interface iUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  email: string;
  role: Role;
  profile: iProfile;
}

export interface iProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  avatar: iImage | null;
  name: iName;
}

export interface iName {
  readonly first: string;
  readonly last: string;
}

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
  avatar?: ImageEntity | null;
  name?: CreateUserName;
}

export interface CreateUserProfile {
  name: CreateUserName;
}

export interface CreateUserName {
  first: string;
  last: string;
}
