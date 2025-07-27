import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {environment} from "../../../../environments/environment";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

//создаем переменную для хранения списка дополнительных товаров
  extraProducts: ProductType[] = [];

//копируем для работы библиотеки карусели из файла main.component.ts
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

  // переменная для хранения состояния информации об актуальном состоянии корзины
  cart: CartType | null = null;

  // создаем переменную для использования пути в URL
  serverStaticPath = environment.serverStaticPath;

  // создаем переменные для общего количества товаров в корзине и стоимости - в специальной карточке
  totalCount: number = 0;
  totalAmount: number = 0;

  constructor(
    private productService: ProductService, //подключаем при создании блока рекомендуемых товаров
    private cartService: CartService, //подключаем при создании сервиса работы с корзиной

  ) {
  }

  ngOnInit(): void {
    // получаем данные о дополнительных товарах для блока страницы cart
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.extraProducts = data;
      });
// получаем данные об актуальном состоянии корзины;
// позже добавляем DefaultResponseType и его обработку, меняем data на data as CartType
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        // добавляем обработку
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        // меняем data на data as CartType
        this.cart = data as CartType;

        // добавляем метод после его создания
        this.calculateTotal();
      })
  }

//создаем метод для подсчета количества товара и общей стоимости в корзине: обнуляем данные,
// проверяем наличие чего-либо в корзине, проходимся по каждому элементу и обновляем данные
  calculateTotal() {
    this.totalCount = 0;
    this.totalAmount = 0;
    if (this.cart) {
      this.cart.items.forEach(item => {
        this.totalCount += item.quantity;
        this.totalAmount += item.quantity * item.product.price;
      });
    }
  }

// создаем метод для изменения количества товаров в корзине
  //позже добавляем DefaultResponseType и его обработку, меняем data на data as CartType
  updateCount(id: string, count: number) {
    if (this.cart) {
      this.cartService.updateCart(id, count)
        .subscribe((data: CartType | DefaultResponseType) => {
          // добавляем обработку
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          //меняем data на data as CartType
          this.cart = data as CartType;
          this.calculateTotal();
        })
    }
  }

}
