//прописываем тип для страницы каталога с учетом получаемых параметров из программы
// Postman -> Types -> Get Types-> Send -> полученный JSON-массив
export type TypeType = {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    url: string;
  },
  url: string;
}
