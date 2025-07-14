import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CatalogComponent} from "./catalog/catalog.component";
import {DetailComponent} from "./detail/detail.component";

const routes: Routes = [
//   прописываем роутинг для созданных компонентов
  {path: 'catalog', component: CatalogComponent},
  // меняем path: 'detail' на path: 'product/:url' для большей понятности при верстке страницы товара
  // {path: 'detail', component: DetailComponent},
  {path: 'product/:url', component: DetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
