import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { DbConnectionService } from '../../dbconnection/dbconnection.service';

@Injectable()
//Strategy assign by default the key 'jwt'
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private dbConnexion: DbConnectionService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  //*
  async validate(payload: {
    sub: number;
    email: string;
  }) {
    const user =
      await this.dbConnexion.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
    delete user.hash;

    //if the user is null, the strategy will fire an unauthorized error
    return user;
  }
  //*/
}
