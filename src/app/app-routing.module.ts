import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {AuthGuard} from "./core/auth/auth.guard";
import {AuthForwardGuard} from "./core/auth/auth-forward.guard";

const routes: Routes = [
  {
    // создаем роуты для LayoutComponent и дочерних компонентов
    path: '',
    component: LayoutComponent,
    children: [
      // первый дочерний компонент - главная страница MainComponent
      {path: '', component: MainComponent},
    //   второй дочерний компонент - модуль пользователя UserModule сразу после создания;
      //позже задаем использование AuthForwardGuard
      {path: '', loadChildren:()=>import('./views/user/user.module').then(m => m.UserModule), canActivate: [AuthForwardGuard]},
    //   третий дочерний компонент - модуль пользователя ProductModule сразу после создания
      {path: '', loadChildren:()=>import('./views/product/product.module').then(m => m.ProductModule)},
    //   четвертый дочерний компонент - модуль пользователя OrderModule сразу после создания
      {path: '', loadChildren:()=>import('./views/order/order.module').then(m => m.OrderModule)},
    //   пятый дочерний компонент - модуль пользователя PersonalModule сразу после создания;
      //позже задаем использование AuthGuard
      {path: '', loadChildren:()=>import('./views/personal/personal.module').then(m => m.PersonalModule), canActivate: [AuthGuard]},
    ]
  }
];

@NgModule({
  // добавляем возможность скроллинга по странице по якорям и переход к верху страницы
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
