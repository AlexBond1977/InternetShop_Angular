import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  // добавляем переменную с массивом товаров
  recommendedProducts: ProductType[] = [];

//создаем переменную для хранения конкретного продукта с утверждением ненулевого типа
  product!: ProductType;

  // создаем переменную для использования пути в URL
  serverStaticPath = environment.serverStaticPath;

// создаем переменную для сохранения количества товара в корзине
  count: number = 1;

// копируем для работы библиотеки карусели из файла main.component.ts
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    // добавляем свой отступ
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    // убираем навигацию библиотеки
    // nav: true
    nav: false
  }

  constructor(private productService: ProductService, //подключаем при создании блока рекомендуемых товаров
              private activatedRoute: ActivatedRoute, //подключаем при создании метода получения продукта
              private cartService: CartService, //при переносе функционала корзины из файла product-card.component.ts
              private favoriteService: FavoriteService,//при реализации функционала добавления товара в избранное
              private authService: AuthService,//при проверке авторизации для добавления товара в избранное
              private _snackBar: MatSnackBar,//при проверке авторизации для добавления товара в избранное
              ) { }

  // // получаем данные о рекомендуемых товарах для соответствующего блока
  ngOnInit(): void {
    // получаем данные из URL о конкретном товаре
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          // сразу при получении данных о продукте устанавливаем их - добаляем при реализации отображения
          // товара в избранное, чтобы он в любом случае был установлен,
          // меняем ниже использование data на this.product
          this.product = data;

          // дополняем запрос на получение информации о наличии товара в корзине при реализации
          //функционала отображения товара в корзине;
          //позже добавляем DefaultResponseType и его обработку для метода getCart(), а также
          //переменную cartDataResponse
          this.cartService.getCart()
            .subscribe((cartData: CartType | DefaultResponseType) => {
              // добавляем обработку
              if((cartData as DefaultResponseType ).error !== undefined){
                throw new Error((cartData as DefaultResponseType ).message);
              }
              //добавляем переменную и меняем ниже cartData на cartDataResponse, чтобы не запутаться
              const cartDataResponse = cartData as CartType;

              // если в корзине есть продукт, то ищем его
              if (cartDataResponse) {
                const productInCart = cartDataResponse.items.find(item => item.product.id === this.product.id);
                // const productInCart = cartData.items.find(item => item.product.id === data.id);
              //если продукт найдем в корзине, то сохраняем его количество и добавляем в общее количество
                if (productInCart) {
                  this.product.countInCart = productInCart.quantity;
                  // data.countInCart = productInCart.quantity;
                  this.count = this.product.countInCart;
                  // this.count = data.countInCart;
                }
              }
              // после этого присваиваем значение в продукт, неважно добавлен или нет продукт в корзину;
              // удаляем при реализации отображения продукта в избранное
              // this.product = data;
            });
          // переносим в код выше
          // this.product = data;

        // делаем запрос на получение нахождения товара в избранном; добавляем данный запрос
        // только для авторизованных пользователей
          if(this.authService.getIsLoggedIn()){
          this.favoriteService.getFavorites()
            .subscribe((data: FavoriteType[] | DefaultResponseType) => {
              if((data as DefaultResponseType ).error !== undefined){
                const error = (data as DefaultResponseType ).message;
                throw new Error(error);
              }
               // переменная для сохранения продуктов
               const products = data as FavoriteType[];
            // переменная для нахождения товара в избранное и добавление
              const currentProductExists = products.find(item => item.id === this.product.id);
              if (currentProductExists) {
                this.product.isInFavorite = true;
              }
            });
          }
        });
    });

// получаем данные из URL о лучших товарах
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts = data;
      })
  }

//создаем метод для определения изменения количества товара, в том числе обновление товара в корзине;
//позже полностью переносим фнукционал из аналогичного метода файла product-card.component.ts при
// реализации функционала отображения товара в корзине, меняем countInCart на product.countInCart,
  updateCount(value: number) {
    this.count = value;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        //позже добавляем DefaultResponseType и его обработку
        .subscribe((data: CartType | DefaultResponseType) => {
          // добавляем обработку
          if((data as DefaultResponseType ).error !== undefined){
            throw new Error((data as DefaultResponseType ).message);
          }
          this.product.countInCart = this.count;
        });
    }
    // console.log(value);
    // this.count = value;
  }

//создаем метод для добавления выбранного количества товаров в корзину
  addToCart() {
    // переносим функционал из аналогичного метода файла product-card.component.ts при реализации
    // функционала отображения товара в корзине, меняем countInCart на product.countInCart, убираем alert
    this.cartService.updateCart(this.product.id, this.count)
      //позже добавляем DefaultResponseType и его обработку
      .subscribe((data: CartType | DefaultResponseType) => {
        // добавляем обработку
        if((data as DefaultResponseType ).error !== undefined){
          throw new Error((data as DefaultResponseType ).message);
        }
        this.product.countInCart = this.count;
      });
    // alert('Добавлено в корзину: ' + this.count);
  }

//переносим полностью метод для удаления товара из корзины из файла файла product-card.component.ts
removeFromCart() {
  this.cartService.updateCart(this.product.id, 0)
    //позже добавляем DefaultResponseType и его обработку
    .subscribe((data: CartType | DefaultResponseType) => {
      // добавляем обработку
      if((data as DefaultResponseType ).error !== undefined){
        throw new Error((data as DefaultResponseType ).message);
      }
      this.product.countInCart = 0;
      this.count = 1;
    });
}

// после заверщения верстки страницы избранное добавляем метод добавления товара в избранное
  updateFavorite(){
    // добавляем проверку авторизации пользователя, если он не авторизован, то завершаем функцию,
    //не выполняем никаких запросов и выдаем сообщение пользователю
    if(!this.authService.getIsLoggedIn()){
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться!');
      return;
    }

    // если товар уже добавлен в избранное, удаляем его, иначе добавляем
    if(this.product.isInFavorite){
      this.favoriteService.removeFavorite(this.product.id)
        .subscribe((data: DefaultResponseType) =>{
          // если выдается ошибка, показываем ее
          if(data.error){
            throw new Error(data.message);
          }
          this.product.isInFavorite = false;
        })
    } else{
      this.favoriteService.updateFavorite(this.product.id)
        .subscribe((data: FavoriteType[] | DefaultResponseType) => {
          // при наличии ошибки выдаем ее
          if((data as DefaultResponseType).error !== undefined){
            throw new Error((data as DefaultResponseType ).message);
          }
          //   если ошибки нет, для текущего продукта устанавливаем флаг добавления в избранное
          this.product.isInFavorite = true;
        });
    }
  }

}
