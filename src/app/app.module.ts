import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './shared/layout/layout.component';
import {HeaderComponent} from './shared/layout/header/header.component';
import {FooterComponent} from './shared/layout/footer/footer.component';
import {MainComponent} from './views/main/main.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {SharedModule} from "./shared/shared.module";
import {CarouselModule} from "ngx-owl-carousel-o";
import {AuthInterceptor} from "./core/auth/auth.interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule, //подключаем после создания сервиса category.service.ts
    MatSnackBarModule, //подключаем Snackbar для вывода сообщений пользователю
    MatMenuModule,//подключаем меню у иконки авторизации в header + возможно где-то еще
    SharedModule, //подключаем при использовании <product-card> в main.component.html
    CarouselModule, //подключаем библиотеку для карусели на странице main.component.html
    FormsModule, //подключаем при реализации функционала поиска товаров через header
    ReactiveFormsModule,//подключаем при замене ngModel на formControl поиск товаров
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
  //   устанавливаем время исчезновения окна с сообщениями
  {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}},
  //   добавляем использование interceptor при создании файла auth.interceptor.ts
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
