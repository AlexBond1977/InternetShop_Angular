import { Component, OnInit } from '@angular/core';
import {CategoryType} from "../../../types/category.type";
import {CategoryService} from "../services/category.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  // после удаления файла layout.component.scss удаляем секцию styleUrls
  // styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  // создаем перемнную как свойства класса Category
  categories: CategoryType[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    // используем созданный метод getCategories() для получения категорий товаров в
    // нижней части header и footer
    this.categoryService.getCategories()
      .subscribe((categories: CategoryType[]) => {
        this.categories = categories;
      });
  }

}
