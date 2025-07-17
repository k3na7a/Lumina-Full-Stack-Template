import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { day } from '@lib/constants/time.constants';

export class HelmetPlugin {
  public static init(app: INestApplication): void {
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://trusted.cdn.com'],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https://images.cdn.com'],
            connectSrc: ["'self'", 'https://api.example.com'],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
          },
        },
        hsts: {
          maxAge: 365 * day,
          includeSubDomains: true,
        },
        frameguard: {
          action: 'sameorigin',
        },
        noSniff: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        hidePoweredBy: true,
      }),
    );
  }
}
