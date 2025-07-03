import { ImageEntity as image } from 'src/app/modules/media/entities/image.entity';
import { UserEntity as user } from 'src/app/modules/users/entities/user.entity';
import { ProfileEntity as profile } from 'src/app/modules/users/entities/profile.entity';
import { GameEntity as game } from 'src/app/modules/games/entities/game.entity';
import { PlatformEntity as platform } from 'src/app/modules/games/entities/platform.entity';

const entities = [image, user, profile, game, platform];

export default entities;
