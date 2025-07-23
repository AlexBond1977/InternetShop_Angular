import {Injectable} from '@angular/core';
import {Observable, Subject, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CartType} from "../../../types/cart.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // создаем переменную для хранения количества товара добавленного в корзину - при отображении количества
  // товара у корзины в header
  count: number = 0;

  // используем для оповещения об изменениях о количестве товара в корзине
  count$: Subject<number> = new Subject<number>();

  constructor(
    private http: HttpClient, //сразу при создании сервиса

  ) {
  }

  //ПОСЛЕ реализации функционала избранное добавляем возможность появления ответа DefaultResponseType
  //в каждый метод

// создаем метод для получения информации об актуальном состоянии корзины; позже при работе с удалением
// товара из корзины добавляем {withCredentials: true} - позволяет Angular работать с сессиями и
//использовать Set-Cookie, передаваемые при отправке запросов - также и для метода updateCart();
  getCart(): Observable<CartType | DefaultResponseType> {
    return this.http.get<CartType | DefaultResponseType>(environment.api + 'cart', {withCredentials: true});
  }

  // создаем метод для отображения количества товара у значка корзины в header
  getCartCount(): Observable<{ count: number }  | DefaultResponseType> {
    return this.http.get<{ count: number} | DefaultResponseType>(environment.api + 'cart/count', {withCredentials: true})
      // добавляем позже для обновления количества товара в корзине непосредственно в сервисе
      .pipe(
        tap(data => {
          // добавляем проверку на ошибку, меняем data на (data as {count: number})
          if(!data.hasOwnProperty('error')){
            this.count = (data as {count: number}).count;
            this.count$.next(this.count);
          }
          // переносим в условие выше и видоизменяем
          // this.count = data.count;
          // this.count$.next(this.count);
        })
      );
  }

  // при создании страницы корзины создаем метод обновления корзины - параметры из программы Postman ->
  // Cart -> POST Cart Update -> Body
  updateCart(productId: string, quantity: number): Observable<CartType | DefaultResponseType> {
    return this.http.post<CartType | DefaultResponseType>(environment.api + 'cart', {productId, quantity}, {withCredentials: true})
      // добавляем позже для обновления количества товара в корзине непосредственно в сервисе
      .pipe(
        tap(data => {
          // добавляем проверку на ошибку, меняем data на (data as CartType)
          if(!data.hasOwnProperty('error')){
            this.count = 0;
            (data as CartType).items.forEach(item => {
              this.count += item.quantity;
            });
            this.count$.next(this.count);
          }
          //переносим в блок условие и изменяем
          // this.count = 0;
          // data.items.forEach(item => {
          //   this.count += item.quantity;
          // });
          // this.count$.next(this.count);
        })
      );
  }
}
