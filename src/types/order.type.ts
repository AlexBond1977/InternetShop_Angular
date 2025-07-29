//прописываем тип для отправки формы заказа с учетом передаваемых  параметров из программы
// Postman -> Orders -> POST Create order -> Body с добавлением fatherName из backend, а также
// при отправке запроса с авторизационным токеном получаем Send -> полученный JSON-массив
import {DeliveryType} from "./delivery.type";
import {PaymentType} from "./payment.type";
import {OrderStatusType} from "./order-status.type";

export type OrderType = {
   deliveryType: DeliveryType,
   firstName: string,
   lastName: string,
   fatherName?: string,
   phone: string,
   paymentType: PaymentType,
   email: string,
   street?: string,
   house?: string,
   entrance?: string,
   apartment?: string,
   comment?: string,
  items?:
    {
       id: string,
       name: string,
       quantity: number,
       price: number,
       total: number,
    }[],
  // добавляем параметры при верстке страницы личного кабинета с заказами пользователя: общая сумма и статус заказа
  totalAmount?: number,
  status?: OrderStatusType,
//добавляем параметры статуса на русском языке и цвета
  statusRus?: string,
  color?: string,
}
