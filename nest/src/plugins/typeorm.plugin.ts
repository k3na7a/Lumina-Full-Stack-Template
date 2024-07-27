import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ProfileEntity } from 'src/library/entities/profile.entity';
import { UserEntity } from 'src/library/entities/user.entity';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'demo_nest_api',
  entities: [UserEntity, ProfileEntity],
  synchronize: true,
};

export class TypeOrmPlugin {
  public static forRoot = TypeOrmModule.forRoot(config);
  public static forFeature = (entities: EntityClassOrSchema[]) =>
    TypeOrmModule.forFeature(entities);
}
