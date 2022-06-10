import { Controller, Get, Res, HttpStatus, Param, Query } from '@nestjs/common';
import { Response } from 'express';

export interface Datos_Lista {
  CompanyId:number;
  UserId:number;
  Method:string;
  Tiempo:number;
  Fecha:Date;
  Source:string;
}

@Controller('datos')
export class DatosController {

     @Get()
     async postDatos(@Res() res: Response){
      const csv = require('csv-parser')
      const fs = require('fs')
      const results = [];
      //fs.createReadStream('src/log.practica.2.csv')
      let csvstream = fs.createReadStream('src/prueba.csv')
      .pipe(csv({headers:['CompanyId', 'UserId', 'Method', 'Tiempo', 'Fecha', 'Source']}))
      .on('error', error => console.error(error))
      .on('data', function (data: any) {
            csvstream.pause();
            csvstream.resume();
            results.push(data)
        })
      .on('end', () => res.status(HttpStatus.OK).json(results))
    }

    @Get('/tiempo?:number')
    async postDatos_tiempo(@Res() res: Response, @Query('number') number){

      const csv = require('csv-parser')
      const fs = require('fs')
      const results = [];
      //fs.createReadStream('src/log.practica.2.csv')
      await fs.createReadStream('src/prueba.csv')
      .pipe(csv({headers:['CompanyId', 'UserId', 'Method', 'Tiempo', 'Fecha', 'Source']}))
      .on('error', error => console.error(error))
      .on('data', (data: any) => results.push(data))
      .on('end', () => res.status(HttpStatus.OK).json(
       results.filter(data => data['Tiempo'] == number)

      ))

    }

    @Get('/company?:number')
    async postDatos_company(@Res() res: Response, @Query('number') number){

      const csv = require('csv-parser')
      const fs = require('fs')
      const results = [];
      //fs.createReadStream('src/log.practica.2.csv')
      let csvstream = await fs.createReadStream('src/prueba.csv')
      .pipe(csv({headers:['CompanyId', 'UserId', 'Method', 'Tiempo', 'Fecha', 'Source']}))
      .on('error', error => console.error(error))
      .on('data', function (data: any) {
            csvstream.pause();
            csvstream.resume();
            results.push(data)
        })
      .on('end', () => res.status(HttpStatus.OK).json(
       results.filter(data => data['CompanyId'] == number)

      ))

    }

    @Get('/user?:number')
    async postDatos_user(@Res() res: Response, @Query('number') number){

      const csv = require('csv-parser')
      const fs = require('fs')
      const results = [];
      //fs.createReadStream('src/log.practica.2.csv')
      let csvstream = await fs.createReadStream('src/prueba.csv')
      .pipe(csv({headers:['CompanyId', 'UserId', 'Method', 'Tiempo', 'Fecha', 'Source']}))
      .on('error', error => console.error(error))
      .on('data', function (data: any) {
            csvstream.pause();
            csvstream.resume();
            results.push(data)
        })
      .on('end', () => res.status(HttpStatus.OK).json(
       results.filter(data => data['UserId'] == number)
      ))

    }

    @Get('/prueba')
    async postDatos_prueba(){
    const csv = require('csv-parser')
    const fs = require('fs')
    const results = [];
    let csvstream = fs.createReadStream('src/prueba.csv')
        .pipe(csv({headers:['CompanyId', 'UserId', 'Method', 'Tiempo', 'Fecha', 'Source']}))
        .on('error', error => console.error(error))
        .on("data", function (row) {
            csvstream.pause();
            csvstream.resume();
            results.push(row)
        })
        .on("end", function () {
            console.log(results)
        })
        .on("error", function (error) {
            console.log(error)
        });


    }



}
