import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeliveryType} from "../../../../types/delivery.type";
import {FormBuilder, Validators} from "@angular/forms";
import {PaymentType} from "../../../../types/payment.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {OrderService} from "../../../shared/services/order.service";
import {OrderType} from "../../../../types/order.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  // копируем из файла cart.component.ts переменную для хранения товаров в корзине
  cart: CartType | null = null;

  // копируем из файла cart.component.ts переменные для общего количества товаров в корзине и стоимости
  totalCount: number = 0;
  totalAmount: number = 0;

  // создаем переменную для определения способа доставки (по умолчанию курьером) - и следом переменную
  // для использования в верстке html
  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes = DeliveryType;

  // создаем переменную способа оплаты для использования в верстке html
  paymentTypes = PaymentType;

  //создаем переменную для формы оформления заказа - свойства из программы Postman -> Orders ->
  //POST Create order -> Body; значения свойств берутся из файла validation.utils.js на backend
  orderForm = this.fb.group({
    //свойство  deliveryType отправляется выше отдельно от формы
    // deliveryType: "delivery",
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    // добавляем из backend необязательное свойство - в Postman его нет
    fatherName: [''],
    phone: ['', Validators.required],
    paymentType: [PaymentType.cashToCourier, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  });

  // создаем возможность использования переменной #popup в файле html
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

  // создаем переменную для хранения состояния вызова dialog библиотеки Angular Material
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private cartService: CartService,//на эту страницу можно попасть только при наличии товара в корзине
    private router: Router, private _snackBar: MatSnackBar,// чтобы нельзя было попасть на
    // страницу оформления заказа, если корзина пустая с выводом сообщения
    private fb: FormBuilder,//добавляем для работы с формой после оформления выбора способа доставки
    private dialog: MatDialog,//добавляем для работы popup с сообщением об успешном оформлении заказа
    private orderService: OrderService,//добавляем для реализации отправки формы заказа
  ) {
    //добавляем обновление валидации сразу при создании компонента
    this.updateDeliveryTypeValidation();
  }

  ngOnInit(): void {
    //копируем из файла cart.component.ts запрос на получение данных из корзины
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cart = data as CartType;
        // при создании страницы оформления заказа добавляем проверку наличия товара в корзине,
        // при отсутствии переводим его на главную страницу
        if (!this.cart || (this.cart && this.cart.items.length === 0)) {
          this._snackBar.open('Корзина пустая!');
          this.router.navigate(['/']);
          return;
        }
        this.calculateTotal();
      })
  }

//копируем из файла cart.component.ts метод для подсчета количества товара и общей стоимости в корзине:
// обнуляем данные,проверяем наличие чего-либо в корзине, проходимся по каждому элементу и обновляем данные
  calculateTotal() {
    this.totalCount = 0;
    this.totalAmount = 0;
    if (this.cart) {
      this.cart.items.forEach(item => {
        this.totalCount += item.quantity;
        this.totalAmount += item.quantity * item.product.price;
      });
    }
  }

//метод для выбора способа доставки
  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type;
  // вызываем функцию изменения валидации при изменении способа доставки
    this.updateDeliveryTypeValidation();
  }

//метод для изменения валидации полей блока адреса: делаем обязательной валидацию блока с адресом
// (улица и номер дома) при доставке курьером и отменяем при самовывозе
  updateDeliveryTypeValidation() {
    if (this.deliveryType === DeliveryType.delivery) {
      this.orderForm.get('street')?.setValidators(Validators.required);
      this.orderForm.get('house')?.setValidators(Validators.required);
    } else {
      this.orderForm.get('street')?.removeValidators(Validators.required);
      this.orderForm.get('house')?.removeValidators(Validators.required);
      // очищаем поля, чтобы они не отправлялись с запросом на backend если были заполнены
      this.orderForm.get('street')?.setValue('');
      this.orderForm.get('house')?.setValue('');
      this.orderForm.get('entrance')?.setValue('');
      this.orderForm.get('apartment')?.setValue('');
    }
    this.orderForm.get('street')?.updateValueAndValidity();
    this.orderForm.get('house')?.updateValueAndValidity();
  }

//метод для создания заказа
  createOrder() {
    if (this.orderForm.valid && this.orderForm.value.firstName && this.orderForm.value.lastName
      && this.orderForm.value.phone && this.orderForm.value.paymentType && this.orderForm.value.email) {
      // добавляем отправку формы заказа
      const paramsObject: OrderType ={
        deliveryType: this.deliveryType,
        firstName: this.orderForm.value.firstName,
        lastName: this.orderForm.value.lastName,
        phone: this.orderForm.value.phone,
        paymentType: this.orderForm.value.paymentType,
        email: this.orderForm.value.email,
      }

      if(this.deliveryType === DeliveryType.delivery) {
        if(this.orderForm.value.street) {
          paramsObject.street = this.orderForm.value.street;
        }
        if(this.orderForm.value.house) {
          paramsObject.house = this.orderForm.value.house;
        }
        if(this.orderForm.value.entrance) {
          paramsObject.entrance = this.orderForm.value.entrance;
        }
        if(this.orderForm.value.apartment) {
          paramsObject.apartment = this.orderForm.value.apartment;
        }
      }

      if(this.orderForm.value.comment) {
        paramsObject.comment = this.orderForm.value.comment;
      }

      this.orderService.createOrder(paramsObject)
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if((data as DefaultResponseType ).error !== undefined){
              const error = (data as DefaultResponseType ).message;
            }
          //переносим код из нижнего блока
            this.dialogRef = this.dialog.open(this.popup);
            this.dialogRef.backdropClick()
              .subscribe(()=>{
                this.router.navigate(['/']);
              });
          //обнуляем количество товара в корзине в header
            this.cartService.setCount(0);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            }else{
              this._snackBar.open('Ощибка заказа!');
            }
          }
        });
      console.log(this.orderForm.value);
    //добавляем использование popup и подписываемся на изменения при нажатии на зону вне popup с переводом
    //пользователя на главную страницу;
    //позже при реализации отправки формы заказа переносим код выше
    //   this.dialogRef = this.dialog.open(this.popup);
    //   this.dialogRef.backdropClick()
    //     .subscribe(()=>{
    //       this.router.navigate(['/']);
    //     });

    //добавляем сообщение о необходимости заполнить поля с их выделением
    }else{
      this.orderForm.markAllAsTouched()
      this._snackBar.open('Заполните необходимые поля!')
    }
  }

  //метод для закрытия popup при нажатии на иокнку крестика
  closePopup(){
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }
}
