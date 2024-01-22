import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import {
  CoreConfigService,
  JWT_SECRECT_KEY,
} from '../config/core/core.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const token = this.extractToken(req.headers.authorization);
      if (!token) {
        return false; // Or handle the case where the token is missing
      }

      const user = this.verifyToken(token);

      if (!user || !user.roles) {
        return false; // Or handle as needed if user or roles are missing
      }

      const hasPermission = () => {
        const userHasRoles = user.roles.some((role) => roles.includes(role));
        if (!userHasRoles) {
          return false;
        }
        return true;
      };

      return hasPermission();
    } catch (error) {
      return false; // Or handle the error according to your application's logic
    }
  }

  private extractToken(authorizationHeader: string | undefined): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return null;
    }

    return tokenParts[1];
  }

  private verifyToken(token: string): any | null {
    try {
      const config = new CoreConfigService();
      const decoded = jwt.verify(token, config.get(JWT_SECRECT_KEY));
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
