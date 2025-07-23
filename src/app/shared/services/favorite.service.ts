import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FavoriteType} from "../../../types/favorite.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private http: HttpClient,//при создании сервиса
  ) { }

//при верстке страницы списка товаров избранное создаем метод для получения товаров, который будет
// возвращать Observable с созданным типом ProductType и использованием 'favorites'
//в URL из программы Postman -> Favorites -> GET Favorites поля GET
  getFavorites(): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.get<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites');
  }

//создаем метод для удаления списка товаров избранное
  removeFavorite(productId: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', {body: {productId}});
  }

  //создаем метод для обновления (добавления) товаров в избранное
  updateFavorite(productId: string): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.post<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites', {productId});
  }
}
