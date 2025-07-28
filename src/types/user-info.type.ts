//прописываем тип для отправки формы с данными пользователя с  учетом передаваемых параметров из
// программы Postman -> User -> POST Update Personal info -> Body с добавлением fatherName из backend,

import {DeliveryType} from "./delivery.type";
import {PaymentType} from "./payment.type";

export type UserInfoType = {
   deliveryType?: DeliveryType,
   firstName?: string,
   lastName?: string,
   fatherName?: string,
   phone?: string,
   paymentType?: PaymentType,
   email: string,
   street?: string,
   house?: string,
   entrance?: string,
   apartment?: string,
}
