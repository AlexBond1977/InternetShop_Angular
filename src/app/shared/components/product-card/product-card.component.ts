import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {FavoriteService} from "../../services/favorite.service";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  // меняем селектор, удаляя app
  // selector: 'app-product-card',
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  // создаем переменную, в которую будет попадать информация о конкретном товаре от родительского
  // элемента, поэтому применяется декоратор @Input с утверждением ненулевого типа с указанием
  // в файле product.component.html для всего блока *ngIf="product"
  @Input() product!: ProductType;

  // создаем переменную для использования пути в URL
  serverStaticPath = environment.serverStaticPath;

  // создаем переменную для отображения количества товара
  count: number = 1;

  // создаем переменную состояния для отображения информации о конкретном товаре
  // в усеченном формате - для страницы корзины блок "с этими товарами также покупают"
  @Input() isLight: boolean = false;

  //создаем переменную для отображения информации о наличии товара в корзине
  @Input() countInCart: number | undefined = 0;

  // создаем переменную для отображения состояния нахождения товара в корзине - удаляем после создания
  // переменной @Input() countInCart
  // isInCart: boolean = false;

  constructor(
    private cartService: CartService,//добавляем при создании метода обновления корзины
    private favoriteService: FavoriteService,//при реализации функционала добавления товара в избранное
    private authService: AuthService,//при проверке авторизации для добавления товара в избранное
    private _snackBar: MatSnackBar,//при проверке авторизации для добавления товара в избранное
    private router: Router,//при изменении функционала из-за бага различных версий товара
  ) {
  }

  ngOnInit(): void {
    //устанавливаем значение товара в корзине, чтобы при обновлении страницы оно отображалось в количестве
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }

//после завершения верстки страницы корзины создаем метод добавления товара в корзину
  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      //позже добавляем DefaultResponseType и его обработку
      .subscribe((data: CartType | DefaultResponseType) => {
        // добавляем обработку
        if((data as DefaultResponseType ).error !== undefined){
          throw new Error((data as DefaultResponseType ).message);
        }
        // меняем флаг состояния нахождения товара в корзине this.isInCart на this.countInCart
        // this.isInCart = true;
        this.countInCart = this.count;
      });
  }

  //создаем метод для определения изменения количества товара, в том числе обновление товара в корзине
  updateCount(value: number) {
    this.count = value;
    // меняем this.isInCart на this.countInCart
    // if (this.isInCart) {
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        //позже добавляем DefaultResponseType и его обработку
        .subscribe((data: CartType | DefaultResponseType) => {
          // добавляем обработку
          if((data as DefaultResponseType ).error !== undefined){
            throw new Error((data as DefaultResponseType ).message);
          }
          // меняем флаг состояния нахождения товара в корзине this.isInCart на this.countInCart
          // this.isInCart = true;
          this.countInCart = this.count;
        });
    }
  }

//создаем метод для удаления товара из корзины при нажатии на кнопку с уже добавленным товаром
  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      //позже добавляем DefaultResponseType и его обработку
      .subscribe((data: CartType | DefaultResponseType) => {
        // добавляем обработку
        if((data as DefaultResponseType ).error !== undefined){
          throw new Error((data as DefaultResponseType ).message);
        }
        // меняем флаг состояния нахождения товара в корзине this.isInCart на this.countInCart
        // this.isInCart = false;
        this.countInCart = 0;
        this.count = 1;
      });
  }

//полностью дублируем метод из файла detail.component.ts
  updateFavorite(){
    if(!this.authService.getIsLoggedIn()){
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться!')
      return;
    }

    if(this.product.isInFavorite){
      this.favoriteService.removeFavorite(this.product.id)
        .subscribe((data: DefaultResponseType) =>{
          if(data.error){
            throw new Error(data.message);
          }
          this.product.isInFavorite = false;
        })
    } else{
      this.favoriteService.updateFavorite(this.product.id)
        .subscribe((data: FavoriteType[] | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined){
            throw new Error((data as DefaultResponseType ).message);
          }
          this.product.isInFavorite = true;
        });
    }
  }

//создаем метод для управления навигацией при выборе товара из-за бага различных версий карточек товара
  navigate(){
    if(this.isLight){
      this.router.navigate(['/product/' + this.product.url]);
    }
  }

}
