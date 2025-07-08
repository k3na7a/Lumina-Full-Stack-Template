import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as csurf from 'csurf';
import { hour } from 'src/library/constants/time.constants';

@Injectable()
export class CsrfGuard implements CanActivate {
  private readonly csrfProtection;

  constructor() {
    this.csrfProtection = csurf({
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1 * hour,
      },
    });
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    return new Promise((resolve, reject) => {
      this.csrfProtection(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}
