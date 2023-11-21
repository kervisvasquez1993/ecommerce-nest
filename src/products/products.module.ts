import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), AuthModule, CategoriesModule],
  exports: [ProductsService, TypeOrmModule]
})
export class ProductsModule { }
