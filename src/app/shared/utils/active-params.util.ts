//на стадии вынесения выбранных фильтров в строку переносим сюда функционал из файла
// category-filter.component.ts - функция принимает параметры из Angular-роутера, обрабатывае
// их и возвращает параметры активного элемента
import {ActiveParamsType} from "../../../types/active-params.type";
import {Params} from "@angular/router";

export class ActiveParamsUtil {
  static processParams(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = {types: []};

    if (params.hasOwnProperty('types')) {
      activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];
    }

    if (params.hasOwnProperty('heightTo')) {
      activeParams.heightTo = params['heightTo'];
    }
    if (params.hasOwnProperty('heightFrom')) {
      activeParams.heightFrom = params['heightFrom'];
    }
    if (params.hasOwnProperty('diameterTo')) {
      activeParams.diameterTo = params['diameterTo'];
    }
    if (params.hasOwnProperty('diameterFrom')) {
      activeParams.diameterFrom = params['diameterFrom'];
    }
    if (params.hasOwnProperty('sort')) {
      activeParams.sort = params['sort'];
    }
    if (params.hasOwnProperty('page')) {
      activeParams.page = +params['page'];
    }
    return activeParams;
  }

}
