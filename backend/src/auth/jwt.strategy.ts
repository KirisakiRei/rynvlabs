import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      const logger = new Logger(JwtStrategy.name);
      logger.warn('JWT_SECRET not set in environment! Using fallback — CHANGE THIS IN PRODUCTION');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || 'rynvlabs-dev-secret-change-in-production',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    return { sub: payload.sub, email: payload.email };
  }
}
