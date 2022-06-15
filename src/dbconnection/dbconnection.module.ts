import { Global, Module } from '@nestjs/common';
import { DbConnectionService } from './dbconnection.service';

@Global()
@Module({
  providers: [DbConnectionService],
  exports: [DbConnectionService],
})
export class DbConnectionModule {}
