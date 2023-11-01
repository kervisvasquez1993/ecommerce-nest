import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { ValidRole } from 'src/auth/interfaces/valid-role';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

 @Get()
 @Auth(ValidRole.superadmin)
 executeSeed(){
  return  this.seedService.runSeed();
 }

  
}
