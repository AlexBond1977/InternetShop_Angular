//прописываем тип с учетом данных категории с добавлением массива с типами продуктов - создаем
// категории, в которых будут прописываться все типы продуктов
export type CategoryWithTypeType = {
  id: string,
  name: string,
  url: string,
  types: {
    id: string,
    name: string,
    url: string,
  }[];
//при подключении перехода по ссылкам на страницу каталога из header и footer создаем для себя
//новое свойство строку массива URL-параметров
  typesUrl?: string[];
}
