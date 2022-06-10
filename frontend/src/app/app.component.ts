import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from "./json.service";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  DatosLista = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private dataService: DataService) { }

  ngOnInit() {
      this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((res: any)=>{
      //console.log(res);
      this.DatosLista = res;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
