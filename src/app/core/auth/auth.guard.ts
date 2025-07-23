import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // создаем constructor, затем инжектим в него AuthService
  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar, //для вывода сообщения о необходимости авторизации
              ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //создаем переменную для состояния авторизации пользователя
    const isLoggedIn = this.authService.getIsLoggedIn();
    //если  пользователь не залогинен - выводим сообщение о необходимости авторизации
    if (!isLoggedIn) {
      this._snackBar.open('Для доступа необходимо авторизоваться!');
    }
    // если пользователь залогинен, разрешаем ему находиться на текущем URL-адресе
    return isLoggedIn;
      // return true;
  }

}
