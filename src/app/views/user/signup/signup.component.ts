import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    passwordRepeat: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    // обязательно надо ставить галочку о согласии
    agree: [false, Validators.requiredTrue],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  // по аналогии с методом login() в login.component.html
  signup() {
    if (this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password
      && this.signupForm.value.passwordRepeat && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.passwordRepeat)
      .subscribe({
        next:(data: LoginResponseType | DefaultResponseType)=> {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          // создаем переменную для результатов регистрации
          const signupResponse = data as LoginResponseType;
          // проверяем ошибку, если не пришли какие-то данные
          if (!signupResponse.accessToken || !signupResponse.refreshToken || !signupResponse.userId) {
            error = 'Ошибка при регистрации!';
          }
          //   проверяем - пришла ли по результатам проверки выше ошибка,
          //   если да, выводим сообщение об этом и прекращаем выполнение кода
          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          // функционал по установке токенов и получению userId добавляем после написания
          // функционала в auth.service.ts
          this.authService.setTokens(signupResponse.accessToken, signupResponse.refreshToken);
          this.authService.userId = signupResponse.userId;

          this._snackBar.open('Вы успешно зарегистрировались!');
          this.router.navigate(['/']);

        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка при регистрации!');
          }
        }
      })
    }
  }

}
