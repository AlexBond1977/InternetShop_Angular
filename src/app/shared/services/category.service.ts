import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, pipe} from "rxjs";
import {CategoryType} from "../../../types/category.type";
import {environment} from "../../../environments/environment";
import {TypeType} from "../../../types/type.type";
import {CategoryWithTypeType} from "../../../types/category-with-type.type";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // после создания сервиса подключаем HttpClient
  constructor(private http: HttpClient) {
  }

//   создаем метод для получения категорий товаров - нижняя часть header, который будет
//   возвращать Observable с созданным типом CategoryType и использованием 'categories'
//   в URL из программы Postman поля GET
  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }

  // создаем метод для получения категорий товаров вместе с типом для страницы каталога, который
  // будет возвращать Observable с созданным типом TypeType и использованием 'types'
//   в URL из программы Postman поля GET.
  //ВАЖНО: сразу же осуществляется преобразование получаемых данных, чтобы возвращался не просто
  //TypeType, а CategoryWithTypeType[]
  getCategoriesWithTypes(): Observable<CategoryWithTypeType[]> {
    return this.http.get<TypeType[]>(environment.api + 'types')
      //   осуществляем промежуточную обработку полученного JSON-массива, преобразуя его в
      //   необходимый для проекта массив информации нового типа CategoryWithType
      .pipe(
        map((items: TypeType[]) => {
          //созаем массив с переработанными категориями
          const array: CategoryWithTypeType[] = [];
          // проходимся по каждому элементу TypeType - необходимо определить категорию каждого
          // элемента и привязать к ней тип
          items.forEach((item: TypeType) => {
            // ищем в полученном массиве уже существующую категорию по URL
            const foundItem = array.find(arrayItem => arrayItem.url === item.category.url);

            // если категория существует, то мы передаем в нее только массив типа
            if(foundItem){
              foundItem.types.push({
                id: item.id,
                name: item.name,
                url: item.url,
              })
            }else {
              //если категории нет, добавляем массив с категорией и массивом типа
              array.push({
                id: item.category.id,
                name: item.category.name,
                url: item.category.url,
                types: [
                  {
                    id: item.id,
                    name: item.name,
                    url: item.url,
                  }
                ]
              });
            }
          });

          return array;
        })
      )
  }

}
