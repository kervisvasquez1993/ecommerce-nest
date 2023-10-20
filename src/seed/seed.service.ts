import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/data-seed';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
  ) { }
  async runSeed() {
    await this.insertNewProducts();
    return { mesage: "Run Seed" }
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProducts();

    const products = initialData.products
    const insertPromise = [];
    products.forEach(product => {
      insertPromise.push(this.productService.create(product))
    })
    await Promise.all(insertPromise)
    
    return {message : true};
  }


}
