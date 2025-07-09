import {Component, Input, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  //При подключении ссылок на каталог товаров меняем тип данных
  // @Input()categories: CategoryType[] = [];
  @Input()categories: CategoryWithTypeType[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
