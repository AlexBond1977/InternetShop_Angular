import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthForwardGuard implements CanActivate {

  // создаем constructor, затем инжектим в него AuthService и Location
  constructor(private authService: AuthService, private location: Location,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // проверяем, если пользователь залогинен, перемещаем его на предыдущую страницу и запрещеаем переход
    // на текущй URL-адрес
    if (this.authService.getIsLoggedIn()) {
      this.location.back();
      return false;
    }
    return true;
  }

}
