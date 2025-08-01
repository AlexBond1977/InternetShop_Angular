import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import {SharedModule} from "../../shared/shared.module";
import {CarouselModule} from "ngx-owl-carousel-o";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    CartComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,//добавляем сразу при создании страницы корзины
    CarouselModule,//добавляем при переносе блока с каруселью
    ReactiveFormsModule,//добавляем при создании функционала формы
    MatDialogModule,//добавляем при создании popup об успешном оформлении заказа
  ]
})
export class OrderModule { }
