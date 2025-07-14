import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";

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
              ) { }

  // // получаем данные о рекомендуемых товарах для соответствующего блока
  ngOnInit(): void {
    // получаем данные из URL о конкретном товаре
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          this.product = data;
        })
    })

// получаем данные из URL о лучших товарах
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts = data;
      })
  }

//создаем метод для определения изменения внутреннего состояния элемента
  updateCount(value: number) {
    console.log(value);
    // добавляем изменение состояния количества товара в корзине
    this.count = value;
  }

//создаем метод для добавления выбранного количества товаров в корзину
  addToCart() {
    alert('Добавлено в корзину: ' + this.count);
  }

}
