import { Injectable } from '@nestjs/common';
import { DbConnectionService } from '../dbconnection/dbconnection.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private dbConnexion: DbConnectionService,
  ) {}
  //Users creation is handle by auth module through Singup

  //Find all users
  findAll() {
    return `This action returns all user`;
  }

  //Find a specific user
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  //Update a user
  async update(
    userId: number,
    dto: UpdateUserDto,
  ) {
    const user =
      await this.dbConnexion.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });
    delete user.hash;
    return user;
  }

  //Delete a specific user by his userID
  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  //Delete all the users
}
