//прописываем тип с учетом получаемых параметров из программы Postman -> Auth ->
// Login -> Send -> при успешной логинации
export type LoginResponseType = {
  accessToken: string;
  refreshToken: string;
  userId: string;
}
