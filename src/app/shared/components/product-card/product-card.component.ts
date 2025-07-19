import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../services/cart.service";
import {CartType} from "../../../../types/cart.type";

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
      .subscribe((data: CartType) => {
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
        .subscribe((data: CartType) => {
          // меняем флаг состояния нахождения товара в корзине this.isInCart на this.countInCart
          // this.isInCart = true;
          this.countInCart = this.count;
        });
    }
  }

//создаем метод для удаления товара из корзины при нажатии на кнопку с уже добавленным товаром
  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        // меняем флаг состояния нахождения товара в корзине this.isInCart на this.countInCart
        // this.isInCart = false;
        this.countInCart = 0;
        this.count = 1;
      });
  }

}
