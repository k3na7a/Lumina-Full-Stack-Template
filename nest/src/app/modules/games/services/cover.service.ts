import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { link, PathLike, unlink } from 'fs';
import { STORAGE } from 'src/library/enums/files.enum';
import { Repository } from 'typeorm';
import { CoverEntity } from '../entities/cover.entity';

@Injectable()
export class CoverService {
  constructor(
    @InjectRepository(CoverEntity)
    private repository: Repository<CoverEntity>,
  ) {}

  private unlinkFile(existingPath: PathLike): void {
    unlink(existingPath, (err: Error | null) => {
      if (err) console.log(err.message);
    });
  }

  private linkFile(existingPath: PathLike, newPath: PathLike): void {
    link(existingPath, newPath, (err: Error | null) => {
      if (err) throw new InternalServerErrorException(err.message);
      this.unlinkFile(existingPath);
    });
  }

  public async create(file: Express.Multer.File): Promise<CoverEntity> {
    const { filename } = file;
    const avatar = this.repository.create({ filename });

    const existingPath = `./upload/${filename}`;
    const newPath = `./public/${STORAGE.COVERS}/${filename}`;

    this.linkFile(existingPath, newPath);

    return this.repository.save(avatar);
  }

  public async findOneById(id: string): Promise<CoverEntity> {
    const avatar = await this.repository.findOne({ where: { id } });
    if (!avatar) throw new NotFoundException();

    return avatar;
  }

  //   public async update(
  //     id: string,
  //     file: Express.Multer.File,
  //   ): Promise<CoverEntity> {
  //     const avatar = await this.findOneById(id);
  //     const { filename } = file;

  //     const existingPath = `./upload/${filename}`;

  //     const newPath = `./public/${STORAGE.AVATARS}/${filename}`;
  //     const prevPath = `./public/${STORAGE.AVATARS}/${avatar.filename}`;

  //     this.linkFile(existingPath, newPath);
  //     this.unlinkFile(prevPath);

  //     return this.repository.save({ ...avatar, filename });
  //   }

  public async remove(id: string): Promise<CoverEntity> {
    const cover = await this.findOneById(id);
    const path = `./public/${STORAGE.COVERS}/${cover.filename}`;

    this.unlinkFile(path);

    return this.repository.remove(cover);
  }
}
