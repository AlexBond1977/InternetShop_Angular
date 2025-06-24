import {Component, Input, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

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
  @Input() categories: CategoryType[] = [];

  // для изменения иконок при авторизации пользователя создается переменная отслеживания состояния
  isLogged: boolean = false;


  // добавляется использование private categoryService: CategoryService - потом убирается
  // добавляется private authService: AuthService для установления состояния регистрации
  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar, //после создания функционала разлогинивания
              private router: Router, // после создания функционала разлогинивания

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
