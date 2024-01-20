import { Module } from '@nestjs/common';
import { NetService } from './net.service';
import { NetController } from './net.controller';

@Module({
  providers: [NetService],
  controllers: [NetController]
})
export class NetModule { } 
