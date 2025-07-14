import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {environment} from "../../../environments/environment";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // после создания сервиса подключаем HttpClient
  constructor(private http: HttpClient) { }

  //   при верстке главной страницы создаем метод для получения лучших товаров, который будет
  //   возвращать Observable с созданным типом ProductType и использованием 'products/best'
  //   в URL из программы Postman поля GET
  getBestProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.api + 'products/best');
  }

  //   при верстке страницы каталог создаем метод для получения лучших товаров, который будет возвращать
  //   Observable с созданным объектом {totalCount: number, pages: number, items: ProductType[]}
  //   и использованием 'products' в URL из программы Postman поля GET
  getProducts(params: ActiveParamsType): Observable<{totalCount: number, pages: number, items: ProductType[]}> {
    return this.http.get<{totalCount: number, pages: number, items: ProductType[]}>(environment.api + 'products', {
      params: params
    });
  }
  // добавляем выше в функцию принятие params: ActiveParamsType и добавляем params после environment.api + 'products'
  // getProducts(): Observable<{totalCount: number, pages: number, items: ProductType[]}> {
  //   return this.http.get<{totalCount: number, pages: number, items: ProductType[]}>(environment.api + 'products');
  // }

  // при создании страницы товара создаем метод получения конкретного продукта - метод принимает url
  getProduct(url: string): Observable<ProductType> {
    return this.http.get<ProductType>(environment.api + 'products/' + url);
  }

}
