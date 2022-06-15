import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DbConnectionService } from '../dbconnection/dbconnection.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitService {
  constructor(
    private dbConnexionService: DbConnectionService,
  ) {}

  //Create a visit to a certain restaurant taking into account that a visit to a restaurant can only be created by the user who created the restaurant
  async createVisitByRestaurantOfUser(
    userId: number,
    restaurantId: number,
    dto: CreateVisitDto,
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
    const visit =
      await this.dbConnexionService.visit.create({
        data: {
          userId,
          restaurantId,
          date: new Date(dto.date),
          expense: dto.expense,
          note: dto.note,
          evaluation: dto.evaluation,
        },
      });

    return visit;
  }

  async showAllVisitsByRestaurant(
    userId: number,
    restaurantId: number,
  ) {
    const info =
      await this.dbConnexionService.visit.aggregate(
        {
          _count: {
            date: true,
          },
          _avg: {
            evaluation: true,
          },
          _sum: {
            expense: true,
          },
          where: {
            userId,
            restaurantId,
          },
        },
      );
    //*/
    const visits =
      await this.dbConnexionService.visit.findMany(
        {
          where: {
            userId,
            restaurantId,
          },
        },
      );
    //console.log({ info, visits });
    return { info, visits };
  }

  findAll() {
    return this.dbConnexionService.visit.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} visit`;
  }

  update(id: number, dto: UpdateVisitDto) {
    return `This action updates a #${id} visit`;
  }

  remove(id: number) {
    return `This action removes a #${id} visit`;
  }
}
