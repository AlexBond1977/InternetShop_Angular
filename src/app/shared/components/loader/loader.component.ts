import { Component, OnInit } from '@angular/core';
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  // создаем переменную для хранения состояния Loader
  isShowed: boolean = false;

  constructor(
    private loaderService: LoaderService,//при создании сервиса
  ) { }

  ngOnInit(): void {
  //получаем данные об изменении состояния Loader из loader.service.ts
    this.loaderService.isShowed$.subscribe((isShowed: boolean) => {
      this.isShowed = isShowed;
    })
  }

}
