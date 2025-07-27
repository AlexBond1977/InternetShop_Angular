//прописываем тип для страницы оформления заказа - выбор способа оплаты, с учетом получаемых
// параметров из backend-> src-> config -> config.js -> секция paymentTypes
export enum PaymentType {
  cashToCourier = 'cashToCourier',
  cardOnline = 'cardOnline',
  cardToCourier = 'cardToCourier',
}
