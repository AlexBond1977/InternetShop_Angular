//прописываем тип для продуктовс учетом получаемых параметров из программы Postman ->
// Products -> Product -> Send -> полученный JSON-массив
export type ProductType = {
  id: string,
  name: string,
  price: number,
  image: string,
  lightning: string,
  humidity: string,
  temperature: string,
  height: number,
  diameter: number,
  url: string,
  type: {
    id: string,
    name: string,
    url: string,
  },
// добавляем опциональное свойство при реализации корзины - количество товара, добавленного в корзину
  countInCart?: number,
//добавляем опциональное свойство при реализации добавления товара в избранное - флаг добавления
  isInFavorite?: boolean,
}
