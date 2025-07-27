//прописываем тип для страницы оформления заказа - выбор способа доставки, с учетом получаемых
// параметров из backend-> src-> config -> config.js -> секция deliveryTypes
export enum DeliveryType {
  delivery = 'delivery',
  self = 'self',
}
