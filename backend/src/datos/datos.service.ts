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
           // se toma en cuenta un intervalo
           if(fecha < f_Inicio){ 
               continue
           }
            //Si la fecha es menor no te toma en cuenta 
           if(fecha > f_Final){
            break
           }
           // Filtros para la consulta
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
                   // Se compara la solicitud con la ultima del usuario para ver si es parte el intervalo
                   if(!intervalActive(lastUser[userId],date,interval)) {
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
   return true;
  }
  if(id_C1 === id_C2){
   return true;
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
  if((segAc-segAn) <= interval*60  ){ // Si diferencia de segundos esta en el intervalo significa que es intervalo activo
      return true // SI es parte del intervalo
  }
  return false // No es parte del intervalo 
  
}
