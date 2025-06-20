import { JwtService } from '@nestjs/jwt';
import { createHmac } from 'crypto';

import { DecodedJWT, JWTInterface } from 'src/library/interfaces/jwt.interface';
import { Payload } from 'src/library/interfaces/payload.interface';

class TokenManager {
  constructor(private readonly jwtService: JwtService) {}

  public async generateTokens(payload: Payload): Promise<JWTInterface> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRY_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_SECRET_KEY,
        expiresIn: process.env.REFRESH_EXPIRY_TIME,
      }),
    ]);
    return { access_token, refresh_token };
  }

  public decode(token: string): DecodedJWT {
    return this.jwtService.decode(token) as DecodedJWT;
  }

  public createHash(data: string): string {
    const hmac = createHmac('sha256', process.env.CRYPTO_SECRET ?? '');
    return hmac.update(data).digest('hex');
  }
}

export { TokenManager };
