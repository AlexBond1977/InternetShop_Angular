import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";

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
              ) { }

  // // получаем данные о рекомендуемых товарах для соответствующего блока
  ngOnInit(): void {
    // получаем данные из URL о конкретном товаре
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          // дополняем запрос на получение информации о наличии товара в корзине при реализации
          //функционала отображения товара в корзине
          this.cartService.getCart()
            .subscribe((cartData: CartType) => {
              // если в корзине есть продукт, то ищем его
              if (cartData) {
                const productInCart = cartData.items.find(item => item.product.id === data.id);
              //если продукт найдем в корзине, то сохраняем его количество и добавляем в общее количество
                if (productInCart) {
                  data.countInCart = productInCart.quantity;
                  this.count = data.countInCart;
                }
              }
              // после этого присваиваем значение в продукт, неважно добавлен или нет продукт в корзину
              this.product = data;
            })
          // переносим в код выше
          // this.product = data;
        })
    })

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
        .subscribe((data: CartType) => {
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
      .subscribe((data: CartType) => {
        this.product.countInCart = this.count;
      });
    // alert('Добавлено в корзину: ' + this.count);
  }

//переносим полностью метод для удаления товара из корзины из файла файла product-card.component.ts
removeFromCart() {
  this.cartService.updateCart(this.product.id, 0)
    .subscribe((data: CartType) => {
      this.product.countInCart = 0;
      this.count = 1;
    });
}

}
