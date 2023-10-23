import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
    getStaticProductImage(imgName: string) {
        const path = join(__dirname, "../../static/products", imgName)
        if (!existsSync(path)) {
            throw new BadRequestException(`Not product found with image ${imgName}`)
        }
        return path
    }
}
