import { Injectable } from '@nestjs/common';
import { Dato } from './datos.entity';

@Injectable()
export class DatosService {
 getDatos(): Dato[] {
   throw new Error('Method not implemented.');
 }
}
