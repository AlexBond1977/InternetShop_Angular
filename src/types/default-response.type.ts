//прописываем тип с учетом получаемых параметров из программы Postman -> Auth ->
// Login -> Send -> при наличии ошибки
export type DefaultResponseType = {
  error: boolean;
  message: string;
}
