import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";

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
  count:number = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
