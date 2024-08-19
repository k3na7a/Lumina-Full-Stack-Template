import { Role } from 'src/library/enums/role.enum';

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

export interface CreateUserProfile {
  name: CreateUserName;
}

export interface CreateUserName {
  first: string;
  last: string;
}
