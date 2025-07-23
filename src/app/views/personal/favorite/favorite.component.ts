import { Component, OnInit } from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  //создаем переменную для хранения товаров избранное
  products: FavoriteType[] = [];
  // создаем переменную для использования пути в URL
  serverStaticPath = environment.serverStaticPath;

  constructor(
    private favoriteService: FavoriteService,// добавляем при создании сервиса
  ) { }

  ngOnInit(): void {
  //запрос на получение товаров избранное
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
       if((data as DefaultResponseType ).error !== undefined){
         const error = (data as DefaultResponseType ).message;
         throw new Error(error);
       }
       this.products = data as FavoriteType[];
    });
  }

//метод удаления товара из избранное
  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
    .subscribe((data: DefaultResponseType) =>{
      // если выдается ошибка, показываем ее
      if(data.error){
        throw new Error(data.message);
      }
      // перезаписываем массив продуктов избранное - если id товара не равен id удаляемого товара, он остается
      this.products = this.products.filter((item) => item.id !== id);
    })
  }

}
