//прописываем тип для страницы личного кабинета с заказами пользователя - статус заказа,
// с учетом получаемых параметров из backend-> src-> config -> config.js -> секция statuses
export enum OrderStatusType {
  new = 'new',
  pending = 'pending',
  delivery = 'delivery',
  cancelled = 'cancelled',
  success = 'success',
}
