import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from "uuid"
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger("ProductsService");
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,


    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>
  ) { }
  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDbExceptions(error)
    }
    return 'This action adds a new product';
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // todo relaciones 
      relations: {
        images: true,
      }
    });
    return products.map(product => ({
      ...product, images: product.images.map(img => img.url)
    }));
  }

  async findOne(term: string) {
    console.log(term)
    let product: Product

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term })
      const query = this.productRepository.createQueryBuilder('prod')
      product = await query.where('UPPER(title) =:title or slug =:slug', {
        title: term.toLocaleLowerCase(),
        slug: term.toLocaleLowerCase()
      })
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
    }
    if (!product) {
      throw new NotFoundException(`Product ${term} not found`);
    }
    return product
  }

  async findOnePlain(term: string) {
    const {images = [], ...rest} = await this.findOne(term)
    return {
      ...rest, images : images.map(img => img.url)
    }

    
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({ id, ...updateProductDto, images: [] })
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    try {
      const response = await this.productRepository.save(product)
      return { data: response }
    } catch (error) {
      this.handleDbExceptions(error)
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return { message: `product whit id ${id} removed successfully` }
  }

  private handleDbExceptions(error: any) {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)

    throw new InternalServerErrorException("Unepected error, check server logs")

  }
}
