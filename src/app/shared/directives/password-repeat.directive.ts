import { Directive } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  //меняем название, убирая app
  // selector: '[appPasswordRepeat]'
  selector: '[appPasswordRepeat]',
//   создаем секцию провайдинга
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordRepeatDirective, multi: true}],
})

// добавляем implements Validator
export class PasswordRepeatDirective implements Validator {

  constructor() { }

  // создаем функцию validate, которая автоматически добавляет синтаксис
  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordRepeat = control.get('passwordRepeat');
    // проверяем на несоответствие значений пароля и повторения пароля
    if(password?.value !== passwordRepeat?.value) {
      passwordRepeat?.setErrors({passwordRepeat: true});
      return {passwordRepeat: true};
    }
    return null;
  }
}
