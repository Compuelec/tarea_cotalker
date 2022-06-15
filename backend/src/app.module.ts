import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataService} from './datos/datos.service';
import { DatosController } from './datos/datos.controller';

@Module({
  imports: [ ],
  controllers: [AppController, DatosController],
  providers: [AppService, DataService],
})
export class AppModule {}
