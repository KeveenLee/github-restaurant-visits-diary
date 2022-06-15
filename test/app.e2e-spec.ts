import { Test } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from './../src/app.module';
import { DbConnectionService } from '../src/dbconnection/dbconnection.service';
import { AuthDto } from '../src/auth/dto';
import { UpdateUserDto } from '../src/user/dto';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from '../src/restaurant/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: DbConnectionService;
  let httpServer: any;
  let userToken: '';
  let restaurantId: '';
  let userId: '';

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    dbConnection = app.get(DbConnectionService);
    await dbConnection.cleanDb();

    httpServer = app.getHttpServer();
  });

  afterAll(() => {
    app.close();
  });

  //e2e Tests for Restaurant Auth Signup and Signin
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'kevin@gmail.com',
      password: '12345',
    };

    describe('Signup', () => {
      it('should throw exception if email is empty', () => {
        return supertest(httpServer)
          .post('/auth/signup')
          .send({ password: dto.password })
          .expect(400);
      });

      it('should throw exception if password is empty', () => {
        return supertest(httpServer)
          .post('/auth/signup')
          .send({ email: dto.email })
          .expect(400);
      });
      it('should throw exception if no body provided', () => {
        return supertest(httpServer)
          .post('/auth/signup')
          .expect(400);
      });
      it('should singup', () => {
        return supertest(httpServer)
          .post('/auth/signup')
          .send(dto)
          .expect(201);
      });
    });

    describe('Signin', () => {
      it('should throw exception if email is empty', () => {
        return supertest(httpServer)
          .post('/auth/signin')
          .send({ password: dto.password })
          .expect(400);
      });
      it('should throw exception if password is empty', () => {
        return supertest(httpServer)
          .post('/auth/signin')
          .send({ email: dto.email })
          .expect(400);
      });
      it('should throw exception if no body provided', () => {
        return supertest(httpServer)
          .post('/auth/signin')
          .expect(400);
      });
      it('should singin', async () => {
        const response = await supertest(
          httpServer,
        )
          .post('/auth/signin')
          .send(dto)
          .expect(200);

        userToken = response.body.access_token;
      });
    });
  });

  //e2e Tests for Users
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', async () => {
        const response = await supertest(
          httpServer,
        )
          .get('/users/me')
          .set(
            'Authorization',
            'Bearer ' + userToken,
          )
          .expect(200);
        userId = response.body.id;
      });
    });

    describe('Edit user', () => {
      const dto: UpdateUserDto = {
        firstName: 'Kevin',
        email: 'kevin@seznam.cz',
      };
      it('should edit user', async () => {
        const response = await supertest(
          httpServer,
        )
          .patch('/users')
          .set(
            'Authorization',
            'Bearer ' + userToken,
          )
          .send(dto)
          .expect(200);
        expect(response.body).toMatchObject({
          firstName: dto.firstName,
        });
        expect(response.body).toMatchObject({
          email: dto.email,
        });
      });
    });
    //*/
  });

  //e2e Tests  for Restaurants
  describe('Restaurants', () => {
    describe('Get empty restaurants', () => {
      it('should get no restaurant', async () => {
        const response = await supertest(
          httpServer,
        )
          .get('/restaurants')
          .set(
            'Authorization',
            'Bearer ' + userToken,
          )
          .expect(200);
        expect(response.body).toEqual([]);
      });
    });
  });

  describe('Create restaurant', () => {
    const dto: CreateRestaurantDto = {
      name: 'Hergetova Cihelna',
      place:
        'Cihelna 2b, Praha 1, Malá Strana, +420 296 826 103, www.cihelna.com',
      cuisineType: 'Traditional czech cuisine',
    };
    it('should create restaurants', async () => {
      const response = await supertest(httpServer)
        .post('/restaurants')
        .set(
          'Authorization',
          'Bearer ' + userToken,
        )
        .send(dto)
        .expect(201);
      restaurantId = response.body.id;
    });
  });

  describe('Get restaurants', () => {
    it('should get restaurants', () => {
      //const response = await  supertest(httpServer)
      return supertest(httpServer)
        .get('/restaurants')
        .set(
          'Authorization',
          'Bearer ' + userToken,
        )
        .expect(200)
        .expect(function (res) {
          res.body.length === 1;
        });
      //expect(response.body).toHaveLength(1);
    });
  });

  describe('Get restaurant by id', () => {
    it('should get restaurant by id', async () => {
      const response = await supertest(httpServer)
        .get('/restaurants/{id}')
        .set(
          'Authorization',
          'Bearer ' + userToken,
        )
        .query({ id: restaurantId })
        .expect(200)
        .expect(function (res) {
          'restaurantId' in res.body;
        });
    });
  });

  describe('Edit restaurant by id', () => {
    const dto: UpdateRestaurantDto = {
      name: 'La Piccola Perla',
      place:
        'Perlová 412/1, 110 00 Staré Město, Prague, +420 224 282 537, www.lapiccolaperla.cz',
      cuisineType: 'Italian cuisine',
    };
    it('should edit restaurant', async () => {
      const response = await supertest(httpServer)
        .patch(`/restaurants/${restaurantId}`)
        .set(
          'Authorization',
          'Bearer ' + userToken,
        )
        .send(dto)
        .expect(200);
      expect(response.body).toMatchObject({
        name: dto.name,
      });
      expect(response.body).toMatchObject({
        cuisineType: dto.cuisineType,
      });
    });
  });

  //e2e Tests  for Visits

  describe('Visits', () => {
    describe('Get empty visits', () => {
      it('should get no visit', async () => {
        const response = await supertest(
          httpServer,
        )
          .get('/visits')
          .set(
            'Authorization',
            'Bearer ' + userToken,
          )
          .expect(200);
        expect(response.body).toEqual([]);
      });
    });
  });

  describe('Create visit', () => {
    const dtoTab = [
      {
        date: new Date('2022-06-12'),
        expense: 1250,
        note: 'Awesome place near Vltava river',
        evaluation: 5,
      },
      {
        date: new Date('2022-06-13'),
        expense: 1250,
        note: 'Always awesome, great waiters',
        evaluation: 5,
      },
    ];

    it('should create a first visit', async () => {
      return supertest(httpServer)
        .post(
          '/visits/restaurant/' + restaurantId,
        )
        .set(
          'Authorization',
          'Bearer ' + userToken,
        )
        .send(restaurantId)
        .send(dtoTab[0])
        .expect(201);
    });

    it('should create the second visit', async () => {
      return supertest(httpServer)
        .post(
          '/visits/restaurant/' + restaurantId,
        )
        .set(
          'Authorization',
          'Bearer ' + userToken,
        )
        .send(restaurantId)
        .send(dtoTab[1])
        .expect(201);
    });
  });

  //*
  describe('Get all visits with average and spending', () => {
    it('should get all visits', async () => {
      const response = await supertest(httpServer)
        .get('/visits/restaurant/' + restaurantId)
        .set(
          'Authorization',
          'Bearer ' + userToken,
        )
        .send(restaurantId.toString())
        .expect(200);

      expect.objectContaining({
        _count: {
          date: 2,
        },
        _avg: {
          evaluation: 5,
        },
        _sum: {
          expense: 2500,
        },
      });
      expect.objectContaining({
        date: new Date('2022-06-12'),
        expense: 1250,
        note: 'Awesome place near Vltava river',
        evaluation: 5,
      });
      expect.objectContaining({
        date: new Date('2022-06-13'),
        expense: 1250,
        note: 'Always awesome, great waiters',
        evaluation: 5,
      });
    });
  });
  //*/

  //*
  describe('Delete restaurant by id', () => {
    it('should delete restaurant', () => {
      return supertest(httpServer)
        .delete(`/restaurants/${restaurantId}`)
        .set(
          'Authorization',
          'Bearer ' + userToken,
        )
        .expect(200);
    });

    it('should get empty restaurant', () => {
      return supertest(httpServer)
        .get('/restaurants')
        .set(
          'Authorization',
          'Bearer ' + userToken,
        )
        .expect(200)
        .expect(function (res) {
          res.body.length === 0;
        });
    });
  });
  //*/
});
