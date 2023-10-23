import { Controller, Get, Post,  Param,  UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer';
import { Response } from 'express';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }


  @Get("product/:imageName")
  findProductImage(
    @Res() res : Response,
    @Param("imageName") imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName)
    res.sendFile(path)
    // res.status(403).json({
    //     ok: false,
    //     path
    // })

  }
  @Post("product")
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits : {fileSize  : 1000}
    storage: diskStorage({
      destination: "./static/products",
      filename: fileNamer
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File,) {


    if (!file) {
      throw new BadRequestException("Make sure the the file is an image")
    }

    const secureUrl = `${file.filename}`
    return { secureUrl }
  }
}
