import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../utils/active-params.util";

@Component({
  // меняем название, убирая app
  // selector: 'app-category-filter',
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {

  // принимаем данные о категориях для последующего использования
  @Input() categoryWithTypes: CategoryWithTypeType | null = null;
  // принимаем данные о числах - высота или диаметр для последующего использования
  @Input() type: string | null = null;
  // создаем переменную для определения состояния компонента фильтра
  open = false;
  // создаем объект для хранения актуальных состояний активных параметров
  activeParams: ActiveParamsType = {types: []};
  // создаем переменные для хранения значений ОТ и ДО диаметра и высоты
  from: number | null = null;
  to: number | null = null;

  // создаем геттер для определения типа получаемых данных: если это категория с типом, возвращаем
  // ее название, иначе проверяем наличие данных с высотой или диаметром и выводим соответствующее
  // значение, при этом данный геттер будет срабатывать столько раз, сколько имеется элементов в
  // <category-filter> в верстке
  get title(): string {
    if (this.categoryWithTypes) {
      return this.categoryWithTypes.name;
    } else if (this.type) {
      if (this.type === 'height') {
        return 'Высота';
      } else if (this.type === 'diameter') {
        return 'Диаметр';
      }
    }
    return '';
  }

  constructor(private router: Router, //при добавлении метода передачи параметров в URL
              private activatedRoute: ActivatedRoute,//при добавлении метода фильтра диаметра и высоты
  ) {
  }

  ngOnInit(): void {
    //подписываемся на отслеживание изменений URL-адреса у каждого компонента - каждый раз при изменении
    //queryParams будем получать их обновленными с выбранными параметрами
    this.activatedRoute.queryParams.subscribe(params => {
      //на стадии вынесения выбранных фильтров в строку переносим весь функционал в файл
      // active-params.util.ts, вставляя здесь использование функции  processParams()

      // // создаем переменную, в которую размещаем
      // const activeParams: ActiveParamsType = {types: []};
      //
      // //проверяем у объекта наличие свойства types
      // if (params.hasOwnProperty('types')) {
      //   // может быть выбран как один, так и несколько фильтров, для нескольких фильтров получаем
      //   // массив params['types'], для одного - создаем массив с params['types']
      //   activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];
      // }
      //
      // if (params.hasOwnProperty('heightTo')) {
      //   activeParams.heightTo = params['heightTo'];
      // }
      // if (params.hasOwnProperty('heightFrom')) {
      //   activeParams.heightFrom = params['heightFrom'];
      // }
      // if (params.hasOwnProperty('diameterTo')) {
      //   activeParams.diameterTo = params['diameterTo'];
      // }
      // if (params.hasOwnProperty('diameterFrom')) {
      //   activeParams.diameterFrom = params['diameterFrom'];
      // }
      // if (params.hasOwnProperty('sort')) {
      //   activeParams.sort = params['sort'];
      // }
      // if (params.hasOwnProperty('page')) {
      //   activeParams.page = +params['page'];
      // }
      // устанавливаем параметры для текущего момента
      // this.activeParams = activeParams;
      this.activeParams = ActiveParamsUtil.processParams(params);

      //для отображения выбранных input и checkbox при обновлении страницы - их сохранения, прописываем
      //соответствующий функционал, проверяем по типу диаметр и высота
      if (this.type) {
        // проверка фильтра по высоте и даиметру
        if (this.type === 'height') {
          // если хотя бы одно значение ОТ или ДО заполнено, то открываем элемент, иначе закрываем
          this.open = !!(this.activeParams.heightFrom || this.activeParams.heightTo);
          //если имеется параметр высоты ОТ и ДО - присваиваем эти значение в from и to или null
          this.from = this.activeParams.heightFrom ? +this.activeParams.heightFrom : null;
          this.to = this.activeParams.heightTo ? +this.activeParams.heightTo : null;
        } else if (this.type === 'diameter') {
          this.open = !!(this.activeParams.diameterFrom || this.activeParams.diameterTo);
          this.from = this.activeParams.diameterFrom ? +this.activeParams.diameterFrom : null;
          this.to = this.activeParams.diameterTo ? +this.activeParams.diameterTo : null;
        }
      } else {
        // присваиваем в активные параметры существующие типы в URL, при этом activeParams должен быть
        // использован в верстке category-filter.component.html в label
        // меняем   this.activeParams.types = params['types']; на проверку
        if (params['types']){
          this.activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];
        }
        // this.activeParams.types = params['types'];

        //выбранные в URL фильтры делают элемент открытым - при отсутствии выбранного фильтра элемент закрыт
        //проходимся через some по всем элементам и при наличии хотя бы одного выбранного фильтра, возвращаем
        //true - элемент будет открытым
        if (this.categoryWithTypes && this.categoryWithTypes.types &&
          this.categoryWithTypes.types.length > 0  &&
          this.categoryWithTypes.types.some(type => this.activeParams.types.find(item => type.url === item))){
          this.open = true;
        }
      }
    });
  }

  // метод изменения состояния компонента
  toggle(): void {
    this.open = !this.open;
  }

//   метод для добавления выбранного в checkbox состояния фильтра с заменой актуального состояния
//активных параметров
  updateFilterParams(url: string, checked: boolean) {
    // проверяем наличие данных в URL
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      const existingTypeInParams = this.activeParams.types.find(item => item === url);
      // если элемент есть в URL, но не выбран в checkbox, удаляем этот элемент из URL
      if (existingTypeInParams && !checked) {
        this.activeParams.types = this.activeParams.types.filter(item => item !== url);
        //   если элемента нет в URL и выбран checkbox, добавляем этот элемент в URL
      } else if (!existingTypeInParams && checked) {
        //Вместо изменения массива, добавляя новый элемент, переприсваиваем в свойство types
        // новый массив с учетом старых элементов и нового элемента - связано с багом Angular !!!
        // this.activeParams.types.push(url);

        this.activeParams.types = [...this.activeParams.types, url]
      }
      //если вообще нет ничего в активных параметрах в URL и выбран элемент, добавляем новый массив в URL
    } else if (checked) {
      this.activeParams.types = [url];
    }
    // добавляем переход на первую страницу при изменении значения фильтра категории товаров
    this.activeParams.page = 1;
    this.router.navigate(['/catalog/'], {
      queryParams: this.activeParams
    });
  }

//создаем метод для фильтра диаметр и высота и проверяем их наличие
  updateFilterParamFromTo(param: string, value: string) {
    if (param === 'heightTo' || param === 'heightFrom' || param === 'diameterTo' || param === 'diameterFrom') {
      // если есть данный активный параметр и он установлен, то удаляем его, иначе добавляем
      if (this.activeParams[param] && !value) {
        delete this.activeParams[param];
      } else {
        this.activeParams[param] = value;
      }
      // добавляем переход на первую страницу при изменении значения фильтра диаметра и высоты
      this.activeParams.page = 1;
      this.router.navigate(['/catalog/'], {
        queryParams: this.activeParams
      });
    }
  }

}
