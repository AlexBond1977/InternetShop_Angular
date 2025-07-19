import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {debounceTime, take} from "rxjs";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  // создаем переменную для хранения продуктов
  products: ProductType[] = [];

  // содаем переменную для хранения категорий с типами товаров
  categoriesWithTypes: CategoryWithTypeType[] = [];

  // создаем переменную с объектом для хранения актуальных состояний активных параметров -
  // при реализации функционала вынесения фильтров в строку
  activeParams: ActiveParamsType = {types: []};

  // создаем переменную с массивом, в котором будут объекты для хранения карточек выбранных фильтров
  // с именем и выбранным URL-параметром из созданного типа
  appliedFilters: AppliedFilterType[] = [];

  // создаем переменную для хранения состояния блока сортировки товара
  sortingOpen = false;

  // создаем переменную с массивом свойств сортировки из объектов и задаем их из статической верстки
  // в динамическую, свойства берутся из программы Postman -> Products -> Get Products -> Params -> sort
  // это параметры для хранения в URL-адресе asc-возрастание, desc-убывание
  sortingOptions: { name: string, value: string }[] = [
    {name: 'От А до Я', value: 'az-asc'},
    {name: 'От Я до А', value: 'az-desc'},
    {name: 'По возрастанию цены', value: 'price-asc'},
    {name: 'По убыванию цены', value: 'price-desc'},
  ];

  // создаем переменную для работы со страницами с пагинацей - перехода по страницам списка товаров
  pages: number [] = [];

  //создаем переменную для хранения состояния корзины
  cart: CartType | null = null;

  constructor(private productService: ProductService, //добавляем сервис после написания метода получения списка товаров
              private categoryService: CategoryService, //добавляем сервис после написания метода получения категорий с типами товаров
              private activatedRoute: ActivatedRoute, //добавляем сервис для отображения выбранных фильтров в строке
              private cartService: CartService, //добавляем для использования в получении состояния корзины
              private router: Router, //добавляем сервис для удаления отображения выбранных фильтров в строке
  ) {
  }

  ngOnInit(): void {
    // при реализации функционала добавления в корзину делаем запрос на получение состояния корзины
    this.cartService.getCart()
      .subscribe((data: CartType) => {
        this.cart = data;
      })

    // переносим функционал из нижней части при создании строки с выбранными фильтрами
    //получаем категории и типы товаров, обработанные в CategoryService
    this.categoryService.getCategoriesWithTypes()
      .subscribe(data => {
        this.categoriesWithTypes = data;
        //в самом конце после реализации верстки и всего функционала, добавляем функционал
        // debounceTime задержки времени для обработки значений, приходящих с Observable
        // this.activatedRoute.queryParams.subscribe(params => {
        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500),
          )
          .subscribe(params => {
          this.activeParams = ActiveParamsUtil.processParams(params);

          //установка выбранных фильтров в строку - обнуляем массив и заполняем его новыми
          //данными: типами с checkbox (категориями) и с input (диаметр и высота)
          this.appliedFilters = [];
          //проходимся циклом по категориям и добавляем при наличии в строку выбранных фильтров
          this.activeParams.types.forEach(url => {
            // проходимся по всем категориям и ищем соответствующий элемент по массиву types
            for (let i = 0; i < this.categoriesWithTypes.length; i++) {
              const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url);
              //если элемент найден, добавляем его в строку с выбранными фильтрами
              if (foundType) {
                this.appliedFilters.push({
                  name: foundType.name,
                  urlParam: foundType.url
                });
              }
            }
          });
          //проверяем наличие параметров по диаметру и высоте, добавляем их в строку выбранных фильтров
          if (this.activeParams.heightFrom) {
            this.appliedFilters.push({
              name: 'Высота: от ' + this.activeParams.heightFrom + ' см',
              urlParam: 'heightFrom'
            });
          }
          if (this.activeParams.heightTo) {
            this.appliedFilters.push({
              name: 'Высота: до ' + this.activeParams.heightTo + ' см',
              urlParam: 'heightTo'
            });
          }
          if (this.activeParams.diameterFrom) {
            this.appliedFilters.push({
              name: 'Диаметр: от ' + this.activeParams.diameterFrom + ' см',
              urlParam: 'diameterFrom'
            });
          }
          if (this.activeParams.diameterTo) {
            this.appliedFilters.push({
              name: 'Диаметр: до ' + this.activeParams.diameterTo + ' см',
              urlParam: 'diameterTo'
            });
          }

          // переносим функционал отправки запроса с выбранными параметрами на backend после изменения
          // параметров URL и установки активных параметров, вставляем внутрь функции this.activeParams
          // и меняем логику в данном методе в файле product.service.ts
          this.productService.getProducts(this.activeParams)
            .subscribe(data => {
              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }
              //при реализации функционала состояния корзины: проверяем наличие элементов в корзине
              // проходимся по продуктам и возвращаем новый массив с замененными элементами
              if(this.cart && this.cart.items.length > 0){
                this.products = data.items.map(product =>{
                  if(this.cart){
                    // перемнная для продукта в корзине
                    const productInCart = this.cart.items.find(item => item.product.id === product.id);
                    if(productInCart){
                      // добавляем то количество товара, которое находится в корзине
                      product.countInCart = productInCart.quantity
                    }
                  }
                  //если товар не в корзине не найден, возвращается то количество, которое есть
                  return product;
                });
              }else{
                this.products = data.items;
              }
              // переносим в else
              // this.products = data.items;
            });
        });

      })


    // ПЕРЕНОСИМ ВЕСЬ ФУНКЦИОНАЛ внутрь выше

    // подписываемся на изменение параметров в URL для отображения выбранных фильтров в строке - после
    // завершения работы с отображением фильтров в URL
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.activeParams = ActiveParamsUtil.processParams(params);
    //
    //   //установка выбранных фильтров в строку - обнуляем массив и заполняем его новыми
    //   //данными: типами с checkbox (категориями) и с input (диаметр и высота)
    //   this.appliedFilters = [];
    //   //проходимся циклом по категориям и добавляем при наличии в строку выбранных фильтров
    //   this.activeParams.types.forEach(url => {
    //     // проходимся по всем категориям и ищем соответствующий элемент по массиву types
    //     for (let i = 0; i < this.categoriesWithTypes.length; i++) {
    //       const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url);
    //       //если элемент найден, добавляем его в строку с выбранными фильтрами
    //       if (foundType) {
    //         this.appliedFilters.push({
    //           name: foundType.name,
    //           urlParam: foundType.url
    //         });
    //       }
    //     }
    //   });
    //   //проверяем наличие параметров по диаметру и высоте, добавляем их в строку выбранных фильтров
    //   if (this.activeParams.heightFrom) {
    //     this.appliedFilters.push({
    //       name: 'Высота: от ' + this.activeParams.heightFrom + ' см',
    //       urlParam: 'heightFrom'
    //     });
    //   }
    //   if (this.activeParams.heightTo) {
    //     this.appliedFilters.push({
    //       name: 'Высота: до ' + this.activeParams.heightTo + ' см',
    //       urlParam: 'heightTo'
    //     });
    //   }
    //   if (this.activeParams.diameterFrom) {
    //     this.appliedFilters.push({
    //       name: 'Диаметр: от ' + this.activeParams.diameterFrom + ' см',
    //       urlParam: 'diameterFrom'
    //     });
    //   }
    //   if (this.activeParams.diameterTo) {
    //     this.appliedFilters.push({
    //       name: 'Диаметр: до ' + this.activeParams.diameterTo + ' см',
    //       urlParam: 'diameterTo'
    //     });
    //   }
    // });

    //ВЫРЕЗАЕМ после завершения всего функционала страницы Каталог и создания запроса на backend
    //для отправки собранных параметров по фильтрам, сортировке и прочего

    //   получаем список товаров
    // this.productService.getProducts()
    //   .subscribe(data => {
    //     //добавляем при установке пагинации - перехода по страницам товаров, обнуляем массив, проходимся
    //     //циклом по страницам (поэтому i=1, а не 0)
    //     this.pages = [];
    //     for (let i = 1; i <= data.pages; i++) {
    //       this.pages.push(i);
    //     }
    //     this.products = data.items;
    //   });

    // при формировании строки с выбранными фильтрами переносим в начало кода ngOnInit, чтобы сначала
    // получались категории
    // //получаем категории и типы товаров, обработанные в CategoryService
    // this.categoryService.getCategoriesWithTypes()
    //   .subscribe(data => {
    //     this.categoriesWithTypes = data;
    //   })
  }

// метод для удаления выбранного фильтра в строке с проверкой диаметра и высоты - удаляем их,
// потом категории - перезаписываем массив без удаляемых элементов и перенаправлением на ту же страницу
  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    if (appliedFilter.urlParam === 'heightFrom' || appliedFilter.urlParam === 'heightTo'
      || appliedFilter.urlParam === 'diameterFrom' || appliedFilter.urlParam === 'diameterTo') {
      delete this.activeParams[appliedFilter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter(item => item !== appliedFilter.urlParam);
    }
    // добавляем переход на первую страницу при обновлении фильтров
    this.activeParams.page = 1;
    this.router.navigate(['/catalog/'], {
      queryParams: this.activeParams
    });
  }

//метод для работы с сортировкой товара - открытие и закрытие вкладки
  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  // метод для работы с отдельными элементами сортировки
  sort(value: string) {
    this.activeParams.sort = value;
    this.router.navigate(['/catalog/'], {
      queryParams: this.activeParams
    });
  }

//метод для перемещения по страницам при нажатии на номер страницы
  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/catalog/'], {
      queryParams: this.activeParams
    });
  }

//методы для перемещения по страницам при нажатии на стрелочки
  openPrevPage(){
    if(this.activeParams.page && this.activeParams.page > 1){
      this.activeParams.page --;
      this.router.navigate(['/catalog/'], {
        queryParams: this.activeParams
      })
    }
  }
  openNextPage(){
    if(this.activeParams.page && this.activeParams.page < this.pages.length){
      this.activeParams.page ++;
      this.router.navigate(['/catalog/'], {
        queryParams: this.activeParams
      })
    }
  }


}
