import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // создаем перемнную как свойства класса Category - затем переносим в файл
  // layout.component.ts, а здесь добавляем декоратор @Input() - и дублируем его
  // в файле footer.component.ts
  // categories: CategoryType[] = [];

  //При подключении ссылок на каталог товаров меняем тип данных
  // @Input() categories: CategoryType[] = [];
  @Input() categories: CategoryWithTypeType[] = [];

  // создаем переменную для использования пути в URL
  serverStaticPath = environment.serverStaticPath;

  // для изменения иконок при авторизации пользователя создается переменная отслеживания состояния
  isLogged: boolean = false;

  // создаем перемнную для отображения количества товаров у значка корзины в header
  count: number = 0;

  //создаем переменную для поиска товара; при создании searchField - удаляем данную переменную
  // searchValue: string = '';

  // создаем переменную для хранения товаров, найденных в результате поиска
  products: ProductType[] = [];

  // задаем переменную - флаг состояния фокуса на input поля поиска товаров для двух способов
  showedSearch: boolean = false;

  // задаем переменную для хранения значений поля поиска и использования Observable при замене
  // использования ngModel на formControl
  searchField = new FormControl();

  // добавляется использование private categoryService: CategoryService - потом убирается
  // добавляется private authService: AuthService для установления состояния регистрации
  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar, //после создания функционала разлогинивания
              private router: Router, // после создания функционала разлогинивания
              private cartService: CartService, //для отображения количества товара у значка порзины
              private productService: ProductService,//для поиска товара
  ) {
    // устанавливается первоначальное состояние регистрации
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    //при замене использования ngModel на formControl подписываемся на изменения поля поиска
    this.searchField.valueChanges
      .pipe( debounceTime(500) )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
              this.showedSearch = true;
            })
        } else {
          this.products = [];
        }
      });

    // используем созданный метод getCategories() для получения категорий товаров в
    // нижней части header ---- поскольку он необходим в footer, переносим его
    // в файл layout.component.ts
    // this.categoryService.getCategories()
    //   .subscribe((categories: CategoryType[]) => {
    //     this.categories = categories;
    //   });

    // подписываемся на subject isLogged$ и устанавливаем актуальное состояние isLogged
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    //запрос на получение количества товара около значка корзины;
    //позже добавляем типы { count: number  | DefaultResponseType} для data, обработку DefaultResponseType,
    //меняем data на (data as {count: number})
    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        //добавляем обработку
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        // меняем data на (data as {count: number})
        this.count = (data as { count: number }).count;
      });

    //подписываемся на изменение количества товара в корзине
    this.cartService.count$.subscribe((count: number) => {
      this.count = count;
    })

  }

//   метод разлогирования пользователя
  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        // при наличии ошибок, не связанных с процессом разлогинивания
        error: () => {
          this.doLogout();
        }
      })
  }

//   метод процесса разлогинивания
  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы успешно вышли из системы!');
    this.router.navigate(['/']);
  }

  //метод поиска товара; удаляем при замене использования ngModel на formControl
//   changeSearchValue(newValue: string) {
//     this.searchValue = newValue;
// //проверяем наличие данных о поиске и минимум трех символов, введенных ползователем
//     if (this.searchValue && this.searchValue.length > 2) {
//       this.productService.searchProducts(this.searchValue)
//         .subscribe((data: ProductType[])=>{
//           this.products = data;
//           //   для второго способа сокрытия списка найденных товаров при клике на страницу
//           this.showedSearch = true;
//         })
//     //   добавляем условие очищения поля ввода
//     }else{
//       this.products = [];
//     }
//   }

//метод перехода к товару, выведенному в списке поиска, с очищением поля поиска и удалением списка товаров
  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    //при замене использования ngModel на formControl убираем this.searchValue, вставляем this.searchField.setValue('');
    // this.searchValue = '';
    this.searchField.setValue('');
    this.products = [];
  }

// метод изменения состояния input поиска товаров для первого способа, ЛАЙФХАК: делаем setTimeout,
// чтобы Angular успевал обработать событие по клику в функции selectProduct() для перехода к товару
// прежде, чем изменится состояние input поиска товаров
  // changedShowSearch(value: boolean) {
  //   setTimeout(()=>{
  //     this.showedSearch = value;
  //   }, 100);
  // }

//   вариант второй отслеживания клика по странице для исчезновения списка товаров в результате поиска
//   создаем декоратор для метода и метод, который будет срабатывать при клике на странице
  @HostListener('document: click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }
}
