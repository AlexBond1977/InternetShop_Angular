import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  // создаем переменную для хранения состояния Loader с возможностью передачи информации
  // в loader.component.ts
  isShowed$ = new Subject<boolean>();

  constructor() { }

// создаем методы открытия и закрытия Loader в компонентах
  show(){
    this.isShowed$.next(true);
  }
  hide(){
    this.isShowed$.next(false);
  }
}
