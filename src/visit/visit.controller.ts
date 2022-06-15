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
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('visits')
export class VisitController {
  constructor(
    private visitService: VisitService,
  ) {}

  //Create a visit
  @Post('restaurant/:id')
  createVisitByRestaurantOfUser(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    restaurantId: number,
    @Body() dto: CreateVisitDto,
  ) {
    return this.visitService.createVisitByRestaurantOfUser(
      userId,
      restaurantId,
      dto,
    );
  }

  @Get('restaurant/:id')
  showAllVisitsByRestaurant(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    restaurantId: number,
  ) {
    return this.visitService.showAllVisitsByRestaurant(
      userId,
      restaurantId,
    );
  }

  @Get()
  findAll() {
    return this.visitService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: string,
  ) {
    return this.visitService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVisitDto: UpdateVisitDto,
  ) {
    return this.visitService.update(
      +id,
      updateVisitDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitService.remove(+id);
  }
}
