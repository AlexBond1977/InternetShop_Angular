//прописываем тип с учетом получаемых параметров из программы Postman -> Products ->
// Get Products -> Params, которые все могут быть или не быть, кроме types
export type ActiveParamsType = {
  types: string[];
  heightFrom?: string;
  heightTo?: string;
  diameterFrom?: string;
  diameterTo?: string;
  sort?: string;
  page?: number;
}
