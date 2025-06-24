import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";

const routes: Routes = [
  {
    // создаем роуты для LayoutComponent и дочерних компонентов
    path: '',
    component: LayoutComponent,
    children: [
      // первый дочерний компонент - главная страница MainComponent
      {path: '', component: MainComponent},
    //   второй дочерний компонент - модуль пользователя UserModule сразу после создания
      {path: '', loadChildren:()=>import('./views/user/user.module').then(m => m.UserModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
