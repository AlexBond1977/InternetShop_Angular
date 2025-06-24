import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoryType} from "../../../types/category.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // после создания сервиса подключаем HttpClient
  constructor(private http: HttpClient) {
  }

//   создаем метод для получения категорий товаров - нижняя часть header, который будет
//   возвращать Observable с созданным типом CategoryType и использованием 'categories'
//   в URL из программы Postman поля GET
  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }

}
