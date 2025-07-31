//прописываем тип для страницы избранное с учетом получаемых параметров из программы
// Postman -> Favorites -> GET Favorites-> Send (обязательно с действительным access-token) ->
// полученный JSON-массив
export type FavoriteType = {
  id: string;
  name: string;
  url: string;
  image: string;
  price: number;
// ДЗ - добавляем свои опциональные значения нахождения товара в корзине и его количество
  inCart?: boolean,
  countInCart?: number;
}
