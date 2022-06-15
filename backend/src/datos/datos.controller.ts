import { Controller, Get, Res, HttpStatus, Param, Query } from '@nestjs/common';
import { Response } from 'express';
import { DataService } from './datos.service';

@Controller('datos')
export class DatosController {

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

  constructor(
      private readonly dataService: DataService
  ){}

  @Get('filtros/id_Co/:id_Co/id_Us/:id_Us/fechas/:fechas/int_v/:int_v')
  async getMany(
      @Param('id_Co') id_Co:number,
      @Param('id_Us') id_Us:number,
      @Param('fechas') fechas: string,
      @Param('int_v') int_v:number

  ){

      const [eventos_users,usuarios] = await this.dataService.getFilter(id_Co,id_Us,fechas,int_v)
      return {
          eventos_users,
          usuarios
      }
  }



}

