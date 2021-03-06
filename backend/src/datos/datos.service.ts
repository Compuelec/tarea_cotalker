import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as rl from 'readline';

@Injectable()
export class DataService {
    constructor(){}
    private readonly Data = 'src/log.practica.2.csv'; // Ruta del archivo
    async getFilter(id_Com:number,id_Usr:number,fechas:string,interval:number){
       //Lectura del Archivo
       const readInterface = rl.createInterface({
           input: fs.createReadStream(this.Data),
           output: process.stdout,
           terminal: false
       });
       const [f_Inicio,f_Final] = fechas.split('_'); //Tomo la fecha inicio y final y las separo
       const eventFecha = {}; // Guarda la cantidad de eventos que genera el usuario en determinada fecha
       const lastUser = {}; // Guarda la ultima sesion activa del usuario
       for await (const line of readInterface){
           const [companyId,userId,method,tiempo,date,source] = line.split(',') // recorro linea por linea y los datos
           const [fecha] = date.split('T') // divido la fecha de la hora

           //  INICIO DE FILTROS Y EVITAR CARGA 

           if(fecha < f_Inicio){ continue } // Si la fecha es menor a la fecha de inicio, la ignora y pasa a la linea siguiente
           if(fecha > f_Final){ break } // Si la fecha que viene es mayor a la fecha final detiene el proceso
           
           // Reviso compañia solicitada && Reviso usuario solicitado
           if(isCompany(id_Com.toString(),companyId) && isUser(id_Usr.toString(),userId)){
               if(!lastUser[userId]){ // Si el usuario no tiene solicitudes previas
                    lastUser[userId] = date;
                    // registro un evento a la fecha
                    if(!eventFecha[fecha]){
                        eventFecha[fecha] = 1 ;
                     } 
                    else {
                        eventFecha[fecha] = eventFecha[fecha] + 1 ;
                    } 
               }
               else{ 
                // MUESTRA DE COMO LLEGAN LOS DATOS
                //eventFecha: 4
                //lastUser:  2017-12-31T18:06:09.994+0000
                //Date:  2017-12-31T18:06:11.716+0000
                //Intervalo:  15
                   // Se compara la solicitud con la ultima del usuario para ver si es parte el intervalo
                   if(!intervalActive(lastUser[userId],date,interval)) {
                    //console.log(lastUser)
                    lastUser[userId] = date;  // se cambia la ultima solicitud del usuario
                    if(!eventFecha[fecha]) eventFecha[fecha] = 1;
                    else eventFecha[fecha] = eventFecha[fecha] + 1 ;   
                   }   
               }
           }
       }
       //console.log(eventFecha) // Verifico los eventos que el usuario tiene por fecha
       //console.log(lastUser) // Ultima conexion del usuario

       
       return [eventFecha,lastUser]
    }
}

function isCompany(id_C1:string,id_C2:string){
  if(id_C1 === '-1' ){
   return true; // Cuando esta condicion de cumple trae a todas las compañias
  }
  if(id_C1 === id_C2){
   return true; // Cuando esta se cumple trae a la compañia especifica 
  }
  return false
}

function isUser(id_U1:string, id_U2:string){
  if(id_U1 === '-1'){
     return true;
  }
  if(id_U1 === id_U2){
    return true;
  }
  return false

}
   //2017-12-31 T 18:06:09 .994+0000
 function intervalActive(fechaAnterior:string, fechaActual:string,interval){
  const [fechaAn,horaAn]= fechaAnterior.split('.')[0].split('T') // Separo fecha y Hora
  const [hAn,mAn,sAn] = horaAn.split(':') // Separo Hora en Hora, Minuto, Segundo
  const [fechaAc,horaAc]= fechaActual.split('.')[0].split('T')
  const [hAc,mAc,sAc] = horaAc.split(':')

  const segAn = Number(hAn)*3600 + Number(mAn)*60 + Number(sAn) // Convierto todo a segundos
  let segAc = Number(hAc)*3600 + Number(mAc)*60 + Number(sAc)
  if(fechaAc !== fechaAn){ // Si hay diferencia de 1 dia en fecha para el intervalo
      segAc = Number(hAc+24)*3600 + Number(mAc)*60 + Number(sAc)
  }
  if((segAc-segAn) <= interval*60  ){ // Si la resta da menos o = que segundos de intervalos, significa que es intervalo activo
      return true // SI es parte del intervalo
  }
  return false // No es parte del intervalo 
  
}
