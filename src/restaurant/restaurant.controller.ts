import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
  ) {}

  //Create a restaurant
  @Post()
  createRestaurant(
    @GetUser('id') userId: number,
    @Body() dto: CreateRestaurantDto,
  ) {
    return this.restaurantService.createRestaurant(
      userId,
      dto,
    );
  }

  //find all the restaurants
  @Get()
  findAllRestaurant() {
    return this.restaurantService.findAllRestaurant();
  }

  //find all the restaurants of a user
  @Get(':id')
  findAllRestaurantOfUser(
    @GetUser('id') userId: number,
  ) {
    return this.restaurantService.findAllRestaurantOfUser(
      userId,
    );
  }

  //find a restaurant by his specific restaurantId
  @Get(':id')
  findOneRestaurant(
    @Param('id', ParseIntPipe)
    restaurantId: number,
  ) {
    return this.restaurantService.findOneRestaurant(
      restaurantId,
    );
  }

  //Modify the informations of a specific restaurant
  @Patch(':id')
  updateRestaurant(
    @Param('id', ParseIntPipe)
    restaurantId: number,
    @Body()
    dto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.updateRestaurant(
      restaurantId,
      dto,
    );
  }

  //Modify the informations of a specific restaurant for a user
  @Patch(':id')
  updateRestaurantForUser(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    restaurantId: number,
    @Body()
    dto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.updateRestaurantForUser(
      userId,
      restaurantId,
      dto,
    );
  }

  //Delete a restaurant by his specific restaurantId
  @Delete(':id')
  deleteRestaurant(
    @Param('id', ParseIntPipe)
    restaurantId: number,
  ) {
    return this.restaurantService.deleteRestaurant(
      restaurantId,
    );
  }

  //Delete a restaurant by his specific restaurantId for an user
  @Delete(':id')
  deleteRestaurantForUser(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    restaurantId: number,
  ) {
    return this.restaurantService.deleteRestaurantForUser(
      userId,
      restaurantId,
    );
  }
}
