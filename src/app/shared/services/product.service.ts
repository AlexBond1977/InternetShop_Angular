import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // после создания сервиса подключаем HttpClient
  constructor(private http: HttpClient) { }

  //   создаем метод для получения товаров, который будет возвращать Observable с созданным типом
  //   ProductType и использованием 'products/best' в URL из программы Postman поля GET
  getBestProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.api + 'products/best');
  }
}
