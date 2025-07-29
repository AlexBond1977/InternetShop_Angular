import { Component, OnInit } from '@angular/core';
import {OrderService} from "../../../shared/services/order.service";
import {OrderType} from "../../../../types/order.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {OrderStatusType} from "../../../../types/order-status.type";
import {OrderStatusUtil} from "../../../shared/utils/order-status.util";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  // создаем переменную для хранения заказов пользователя
  orders: OrderType[] = [];

  constructor(
    private orderService: OrderService,//добавляем в процессе верстки страницы html
  ) { }

  ngOnInit(): void {
  //запрос на получение заказов пользователя
    this.orderService.getOrders()
      .subscribe((data: OrderType[] | DefaultResponseType) => {
        if((data as DefaultResponseType ).error !== undefined){
          throw new Error((data as DefaultResponseType ).message);
        }
        //при обработке статуса заказа по цвету и тексту перерабатываем получение информации о заказе
        // this.orders = data as OrderType[];
        this.orders = (data as OrderType[]).map(item=>{
          const status = OrderStatusUtil.getStatusAndColor(item.status)

          item.statusRus = status.name;
          item.color = status.color;

          return item;
        });
      });
  }

}
