import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  // меняем название на count-selector вместо app-count-selector
  // selector: 'app-count-selector',
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent implements OnInit {

  // создаем переменную для хранения количества товаров;
  // count: number = 1;
  // для того, чтобы при обновлении страницы сохранялись выбранные пользователем значения, используем
  // @Input() для получения от родительского компонента текущего количества товаров
  @Input() count: number = 1;

  // создаем переменную для отслеживания изменений и передачи их в родительский компонент
  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

//создаем метод получения нового значения (emit) для отправки его родительскому компоненту - при использовании
//одностороннего бандинга, но лучше использовать двусторонний бандинг
//   countChange(value: number){
//     this.count = value;
//     this.onCountChange.emit(value);
//   }
  countChange(){
    this.onCountChange.emit(this.count);
  }

//создаем методы для уменьшения количества товара при нажатии на "-" и увеличении количества товара
//при нажатии на "+";
// после привязки отправки изменений родительскому компоненту, вызываем метод this.countChange()
  decreaseCount(){
    if(this.count >1){
      this.count--;
      this.countChange();
    }
  }
  increaseCount(){
      this.count++;
    this.countChange();
  }

}
