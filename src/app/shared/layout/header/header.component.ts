import {Component, Input, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";

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

  // для изменения иконок при авторизации пользователя создается переменная отслеживания состояния
  isLogged: boolean = false;

  // создаем перемнную для отображения количества товаров у значка корзины в header
  count: number = 0;

  // добавляется использование private categoryService: CategoryService - потом убирается
  // добавляется private authService: AuthService для установления состояния регистрации
  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar, //после создания функционала разлогинивания
              private router: Router, // после создания функционала разлогинивания
              private cartService: CartService, //для отображения количества товара у значка порзины

  ) {
    // устанавливается первоначальное состояние регистрации
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
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
      .subscribe((data: { count: number } | DefaultResponseType)=> {
        //добавляем обработку
        if((data as DefaultResponseType ).error !== undefined){
          throw new Error((data as DefaultResponseType ).message);
        }
        // меняем data на (data as {count: number})
        this.count = (data as {count: number}).count;
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
}
