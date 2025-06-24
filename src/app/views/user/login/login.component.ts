import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // создаем переменнную со свойствами класса с использованием FormBuilder, который
  // инжектится в constructor для группы в виде объекта полей валидации
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor(private fb: FormBuilder, // при создании валидации форм
              private authService: AuthService, //при создании сервиса авторизации
              private _snackBar: MatSnackBar, //при создании вывода сообщений пользователю
              private router: Router, //для перехода при авторизации

  ) {}

  ngOnInit(): void {
  }

//   функция отправки запроса на авторизацию с проверкой успешной валидации и наличия значений
//   в полях email и password, два !! приводят к boolean-значению, даже если придет null или undefined
  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next:(data: LoginResponseType | DefaultResponseType)=> {
            // проверяем, что пришла не ошибка
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            // создаем переменную для результатов авториации
            const loginResponse = data as LoginResponseType;
            // проверяем ошибку, если не пришли какие-то данные
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка при авторизации!';
            }
            //   проверяем - пришла ли по результатам проверки выше ошибка,
            //   если да, выводим сообщение об этом и прекращаем выполнение кода
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            // функционал по установке токенов и получению userId добавляем после написания
            // функционала в auth.service.ts
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this._snackBar.open('Вы успешно авторизовались!');
            this.router.navigate(['/']);
          },
          // обработка ошибки не статуса 400 - просто любая ошибка не из DefaultResponseType
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              // сначала подключаем Snackbar из библиотеки Angular Material
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка при авторизации!');
            }
          }
        })
    }
  }

}
