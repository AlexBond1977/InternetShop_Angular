//прописываем тип для корзины с учетом получаемых параметров из программы Postman ->
// Cart -> Get Cart -> Send -> полученный JSON-массив - ВАЖНО наличие товара в корзине!!!
export type CartType = {
  items: {
      product: {
        id: string,
        name: string,
        price: number,
        image: string,
        url: string,
      },
      quantity: number,
    }[]
}
