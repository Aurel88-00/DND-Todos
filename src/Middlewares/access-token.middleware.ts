// src/common/middleware/attach-access-token.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AttachAccessTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const accessToken =
      req.cookies?.access_token ||
      req.headers['x-access-token'] ||
      req.headers['authorization'];

    if (accessToken) {
      req.headers['authorization'] = `Bearer ${accessToken}`;
    }

    next();
  }
}
