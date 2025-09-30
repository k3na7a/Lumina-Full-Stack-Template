import { ImageEntity as image } from 'src/modules/media/entities/image.entity';
import { UserEntity as user } from 'src/modules/users/entities/user.entity';
import { ProfileEntity as profile } from 'src/modules/users/entities/profile.entity';
import { RoleEntity as role } from 'src/modules/users/entities/role.entity';
import { PermissionEntity as permission } from 'src/modules/users/entities/permission.entity';
import { GameEntity as game } from 'src/modules/games/entities/game.entity';
import { PlatformEntity as platform } from 'src/modules/games/entities/platform.entity';
import { AuditEntity as audit } from 'src/modules/audit/entities/audit.entity';

const entities = [audit, image, user, profile, role, game, platform, permission];

export default entities;
