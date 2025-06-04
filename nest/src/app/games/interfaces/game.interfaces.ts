import { ImageEntity } from 'src/app/media/entities/image.entity';
import { CreateGameDto } from '../dto/game.dto';

class Assets {
  public coverLarge: ImageEntity | null;

  constructor(payload: { coverLarge: ImageEntity | null }) {
    this.coverLarge = payload.coverLarge;
  }
}

class CreateGame {
  public name: string;
  public release_date: Date;
  public slug: string;
  public description?: string;
  public assets: Assets;

  constructor(dto: CreateGameDto, cover: ImageEntity | null) {
    this.name = dto.name;
    this.release_date = dto.release_date;
    this.description = dto.description;

    this.slug = dto.slug;

    this.assets = new Assets({
      coverLarge: cover,
    });
  }
}

export { CreateGame };
