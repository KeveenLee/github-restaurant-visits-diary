import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DbConnectionService } from '../dbconnection/dbconnection.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private dbConnexion: DbConnectionService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(dto.password);
    //save the new user in the db
    try {
      const user =
        await this.dbConnexion.user.create({
          data: {
            email: dto.email,
            hash,
          },
        });

      //not return the saved user directly but the tocken
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    //find the user by email
    const user =
      await this.dbConnexion.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    //if user does not exist throw exception
    if (!user)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    //Compare password
    const passwordMatches = await argon.verify(
      user.hash,
      dto.password,
    );

    //if password incorrect throw exception
    if (!passwordMatches)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    //not send back directly the user but the token
    //return this.signToken(user.id, user.email);
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '30m',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }
}
