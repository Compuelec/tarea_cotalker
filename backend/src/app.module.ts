import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatosController } from './datos/datos.controller';
import { DatosService} from './datos/datos.service';

@Module({
  imports: [ ],
  controllers: [AppController, DatosController],
  providers: [AppService, DatosService],
})
export class AppModule {}
