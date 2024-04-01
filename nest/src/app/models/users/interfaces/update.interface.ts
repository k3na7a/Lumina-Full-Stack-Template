import { Role } from 'src/library/enums/role.enum';

export interface UpdateUserInterface {
  email?: string;
  password?: string;
  role?: Role;
  refreshToken?: string | null;
}
