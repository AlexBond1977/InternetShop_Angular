//прописываем тип с учетом получаемых параметров из программы Postman -> Category ->
// Get Categories -> Send -> полученный JSON-массив
export type CategoryType = {
  id: string;
  name: string;
  url: string;
}
