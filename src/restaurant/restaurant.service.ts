import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { DbConnectionService } from '../dbconnection/dbconnection.service';

@Injectable()
export class RestaurantService {
  constructor(
    private dbConnexionService: DbConnectionService,
  ) {}

  //Create a restaurant
  async createRestaurant(
    userId: number,
    dto: CreateRestaurantDto,
  ) {
    const restaurant =
      await this.dbConnexionService.restaurant.create(
        {
          data: {
            userId,
            ...dto,
          },
        },
      );

    return restaurant;
  }

  //find all the restaurants
  findAllRestaurant() {
    return this.dbConnexionService.restaurant.findMany();
  }

  //find all the restaurants of a user
  findAllRestaurantOfUser(userId: number) {
    return this.dbConnexionService.restaurant.findMany(
      {
        where: {
          userId,
        },
      },
    );
  }

  //find a restaurant by his specific restaurantId
  findOneRestaurant(restaurantId: number) {
    return this.dbConnexionService.restaurant.findUnique(
      {
        where: {
          id: restaurantId,
        },
      },
    );
  }

  //Modify the informations of a specific restaurant
  async updateRestaurant(
    restaurantId: number,
    dto: UpdateRestaurantDto,
  ) {
    //get the restaurant by id
    const restaurant =
      await this.dbConnexionService.restaurant.findUnique(
        {
          where: {
            id: restaurantId,
          },
        },
      );

    //check if user owns the restaurant
    if (!restaurant)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.dbConnexionService.restaurant.update(
      {
        where: {
          id: restaurantId,
        },
        data: {
          ...dto,
        },
      },
    );
  }

  //Modify the informations of a specific restaurant for a user
  async updateRestaurantForUser(
    userId: number,
    restaurantId: number,
    dto: UpdateRestaurantDto,
  ) {
    //get the restaurant by id
    const restaurant =
      await this.dbConnexionService.restaurant.findUnique(
        {
          where: {
            id: restaurantId,
          },
        },
      );

    //check if user owns the restaurant
    if (
      !restaurant ||
      restaurant.userId !== userId
    )
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.dbConnexionService.restaurant.update(
      {
        where: {
          id: restaurantId,
        },
        data: {
          ...dto,
        },
      },
    );
  }

  //Delete a restaurant by his specific restaurantId
  async deleteRestaurant(restaurantId: number) {
    const restaurant =
      await this.dbConnexionService.restaurant.findUnique(
        {
          where: {
            id: restaurantId,
          },
        },
      );

    //check if user owns the restaurant
    if (!restaurant)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.dbConnexionService.restaurant.delete(
      {
        where: {
          id: restaurantId,
        },
      },
    );
  }

  //Delete a restaurant by his specific restaurantId for a user
  async deleteRestaurantForUser(
    userId: number,
    restaurantId: number,
  ) {
    const restaurant =
      await this.dbConnexionService.restaurant.findUnique(
        {
          where: {
            id: restaurantId,
          },
        },
      );

    //check if user owns the restaurant
    if (
      !restaurant ||
      restaurant.userId !== userId
    )
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.dbConnexionService.restaurant.delete(
      {
        where: {
          id: restaurantId,
        },
      },
    );
  }
}
