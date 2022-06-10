import {Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { retry, catchError, tap } from 'rxjs/operators';
import { Datos_Lista } from "../modelos/listadatos.interface";
import {  throwError } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class DataService {

  private REST_API_SERVER = "http://localhost:4100/";

  constructor(private httpClient: HttpClient) { }
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }


public sendGetRequest(){
    return this.httpClient.get<Datos_Lista>(this.REST_API_SERVER+'datos/user?number=2').pipe(retry(3), catchError(this.handleError));
  }



}
