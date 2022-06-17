import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';


interface Variables_t{
  eventos_users:{
      [fecha: string]: number
  },
  usuarios:{ }
}

@Component({
  selector: 'app-grafico',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css']
})

export class LineaComponent implements OnInit {
  /* Variables del Formulario inicial*/
  idCompForm = new FormControl('1');
  idUserForm = new FormControl('-1');
  fAntForm = new FormControl('2017-01-01')
  fActForm = new FormControl('2018-01-01')
  interForm = new FormControl(15)

// Variables de Datos
  usuarios = [''];

  // Variables de vizualización Grafico y Loading
  mostrarGrafico = false
  mostrarLoading = false

  // Variables del Grafico
  lineChartData: ChartDataSets[]=[
    {data:[]}
  ]
  lineChartLabels: Label[]=[]
  lineChartOptions: ChartOptions = {
    responsive: true,
  }
  lineChartColors: Color[] = [
    {
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    }
  ]
  lineChartLegend = true;
  lineChartType: ChartType = 'line';
  lineChartPlugins =[];
  
  constructor(
    private httpClient: HttpClient
  ) {
    this.idCompForm.valueChanges.pipe().subscribe(()=>{
      this.idUserForm = new FormControl('-1');
      this.usuarios=['-1'];
    })
  }

  ngOnInit(): void {}

  async seach(){
    this.mostrarGrafico = false
    this.mostrarLoading = true
    const url = `http://localhost:4100`
    const solicitud = `/datos/filtros/id_Co/${this.idCompForm.value}/id_Us/${this.idUserForm.value}/fechas/${this.fAntForm.value}_${this.fActForm.value}/int_v/${this.interForm.value}`
    console.log(url+solicitud)
    await this.httpClient.get<Variables_t>(url+solicitud)
    .subscribe(res=>{
      if(this.idUserForm.value === '-1') this.usuarios = Object.keys(res.usuarios);
      this.lineChartData=[
        {data: Object.values(res.eventos_users), label: 'Número de Eventos', hitRadius:0.5}
      ]
      this.lineChartLabels= Object.keys(res.eventos_users)
      this.mostrarGrafico = true
      this.mostrarLoading = false
    })
  }
}