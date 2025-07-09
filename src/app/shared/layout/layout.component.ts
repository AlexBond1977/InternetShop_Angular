import { Component, OnInit } from '@angular/core';
import {CategoryType} from "../../../types/category.type";
import {CategoryService} from "../services/category.service";
import {CategoryWithTypeType} from "../../../types/category-with-type.type";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  // после удаления файла layout.component.scss удаляем секцию styleUrls
  // styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  // создаем перемнную как свойства класса Category - меняем ее при подключении ссылок на каталог
  // categories: CategoryType[] = [];
  categories: CategoryWithTypeType[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    // используем созданный метод getCategories() для получения категорий товаров в
    // нижней части header и footer
    // При подключении ссылок на каталог товаров меняем getCategories() на getCategoriesWithTypes()
    // this.categoryService.getCategories()
    this.categoryService.getCategoriesWithTypes()
      //меняем тип CategoryType[] на CategoryWithTypeType[]
      // .subscribe((categories: CategoryType[]) => {
      .subscribe((categories: CategoryWithTypeType[]) => {
        //при создании ссылок на страницу каталог меняем this.categories = categories, чтобы сразу
        // преобразовать категории в необходимый формат - массив из URL-параметров, проходимся по
        // массиву и возвращаем item.url - с помощью создаем на основе двух объектов новый
        // this.categories = categories;
        this.categories = categories.map(item=>{
          return Object.assign({typesUrl: item.types.map(item => item.url)}, item)
        });
      });
  }

}
