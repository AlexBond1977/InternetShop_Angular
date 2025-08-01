import {Component, Input, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  //создаем переменную для хранения товаров избранное
  products: FavoriteType[] = [];

  // создаем переменную для использования пути в URL
  serverStaticPath = environment.serverStaticPath;

  // ДЗ - создаем переменную для хранения товара в корзине
  productsInCart: CartType | null = null;

  @Input() product!: ProductType;
  @Input() countInCart: number | undefined = 0;
  count: number = 1;

  constructor(
    private favoriteService: FavoriteService,// добавляем при создании сервиса
    private cartService: CartService,//ДЗ добавляем при использовании корзины
  ) {
  }

  ngOnInit(): void {
    // ДЗ - добавляем получение товара в корзине для избранное
    this.cartService.getCart()
      .subscribe((cartData: CartType | DefaultResponseType) => {
        if ((cartData as DefaultResponseType).error !== undefined) {
          const error = (cartData as DefaultResponseType).message;
          throw new Error(error);
        }

        this.productsInCart = cartData as CartType;

        //запрос на получение товаров избранное
        this.favoriteService.getFavorites()
          .subscribe((data: FavoriteType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              throw new Error(error);
            }
            // ДЗ - меняем простое получение товаров в избранное с учетом добавления в корзину
            // this.products = data as FavoriteType[];

            this.products = (data as FavoriteType[]).map((product: FavoriteType) => {
              if (this.productsInCart) {
                const productInCart = this.productsInCart.items.find(item => item.product.id === product.id);
                if (productInCart) {
                  product.inCart = true;
                  product.countInCart = productInCart.quantity;
                  this.updateCount(product.id, product.countInCart);
                }
              }
              return product;
            });
          });
      });
  }

//метод удаления товара из избранное
  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        // если выдается ошибка, показываем ее
        if (data.error) {
          throw new Error(data.message);
        }
        // перезаписываем массив продуктов избранное - если id товара не равен id удаляемого товара, он остается
        this.products = this.products.filter((item) => item.id !== id);
      })
  }

  //ДЗ - метод добавления товара в корзину
  addToCart(id: string) {
    this.cartService.updateCart(id, 1)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        const productToCart: FavoriteType | undefined = this.products.find((product: FavoriteType) => product.id === id);
        if (productToCart) {
          productToCart.inCart = true;
          productToCart.countInCart = 1;
        }
      });
  }

  // ДЗ - добавляем метод обновления количества товарв в корзине
  updateCount(id: string, value: number ) {
    const product = this.products.find((product: FavoriteType) => product.id === id);
    if (product && product.countInCart) {
      product.countInCart = value;
      this.cartService.updateCart(product.id, product.countInCart)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          this.productsInCart = data as CartType;
          product.countInCart = this.productsInCart.items.find(item => item.product.id === product.id)?.quantity;
        });
    }
  }

  //ДЗ - создаем метод для удаления товара из корзины при нажатии на кнопку с уже добавленным товаром
  removeFromCart(id: string) {
    this.cartService.updateCart(id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        const productToRemove = this.products.find(product => product.id === id);
        if (productToRemove) {
          productToRemove.countInCart = 0;
          this.count = 1;
        }
      });
  }


}
