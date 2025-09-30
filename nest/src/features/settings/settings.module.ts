import { Module } from '@nestjs/common';

import { ProfileController } from './controllers/profile.controller';
import { SecurityController } from './controllers/security-and-privacy.controller';
import { SettingsService } from './services/settings.service';
import { MediaModule } from 'src/modules/media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [ProfileController, SecurityController],
  providers: [SettingsService],
  exports: [SettingsService],
})
class SettingsModule {}

export { SettingsModule };
