import {Component, OnInit} from '@angular/core';
import {DeliveryType} from "../../../../types/delivery.type";
import {PaymentType} from "../../../../types/payment.type";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../shared/services/user.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserInfoType} from "../../../../types/user-info.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
// переносим все перемнные из файла order.component.ts с некоторыми изменениями
  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes = DeliveryType;

  paymentTypes = PaymentType;

  userInfoForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    fatherName: [''],
    phone: [''],
    paymentType: [PaymentType.cashToCourier],
    // единственное обязательное поле для пользователя при сохранении данных
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
  })

  constructor(
    private fb: FormBuilder,//добавляем для работы с формой личного кабинета
    private userService: UserService,//добавляем при создании сервиса
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  //   запрос на получение данных о пользователе
    this.userService.getUserInfo()
      .subscribe((data: UserInfoType | DefaultResponseType) => {
        if((data as DefaultResponseType ).error !== undefined){
          throw new Error((data as DefaultResponseType ).message);
        }
        // переменная для данных о пользователе и переменная для установленных данных пользователя
        const userInfo = data as UserInfoType;
        const paramsToUpdate = {
          firstName: userInfo.firstName ? userInfo.firstName : '',
          lastName: userInfo.lastName ? userInfo.lastName : '',
          fatherName: userInfo.fatherName ? userInfo.fatherName : '',
          phone: userInfo.phone ? userInfo.phone : '',
          paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cashToCourier,
          email: userInfo.email ? userInfo.email : '',
          street: userInfo.street ? userInfo.street : '',
          house: userInfo.house ? userInfo.house : '',
          entrance: userInfo.entrance ? userInfo.entrance : '',
          apartment: userInfo.apartment ? userInfo.apartment : '',
        }

        this.userInfoForm.setValue(paramsToUpdate);
        if(userInfo.deliveryType){
          this.deliveryType = userInfo.deliveryType;
        }
      });
  }

  //метод установки способа доставки
  changeDeliveryType(deliveryType: DeliveryType) {
    this.deliveryType = deliveryType;

    this.userInfoForm.markAsDirty();
  }

  //метод сохранения формы
  updateUserInfo(){
    // если форма валидна, обновляем данные пользователя
    if(this.userInfoForm.valid){
      // устанавливаются в переменной объект с обязательными к выбору параметры, в который будут
      // добавляться выбранные пользователем не обязательные параметры
      const paramObject: UserInfoType = {
        email: this.userInfoForm.value.email ? this.userInfoForm.value.email : '',
        deliveryType: this.deliveryType,
        paymentType: this.userInfoForm.value.paymentType ? this.userInfoForm.value.paymentType : PaymentType.cashToCourier,
      }

      // проверяем наличие необязательных параметров,заполненных пользователем, и добавляем их
      if(this.userInfoForm.value.firstName){
        paramObject.firstName = this.userInfoForm.value.firstName;
      }
      if(this.userInfoForm.value.lastName){
        paramObject.lastName = this.userInfoForm.value.lastName;
      }
      if(this.userInfoForm.value.fatherName){
        paramObject.fatherName = this.userInfoForm.value.fatherName;
      }
      if(this.userInfoForm.value.phone){
        paramObject.phone = this.userInfoForm.value.phone;
      }
      if(this.userInfoForm.value.street){
        paramObject.street = this.userInfoForm.value.street;
      }
      if(this.userInfoForm.value.house){
        paramObject.house = this.userInfoForm.value.house;
      }
      if(this.userInfoForm.value.entrance){
        paramObject.entrance = this.userInfoForm.value.entrance;
      }
      if(this.userInfoForm.value.apartment){
        paramObject.apartment = this.userInfoForm.value.apartment;
      }

      this.userService.updateUserInfo(paramObject)
        .subscribe({
          next: (data: DefaultResponseType)=>{
          if(data.error){
            this._snackBar.open(data.message);
            throw new Error(data.message);
          }

            this._snackBar.open('Данные успешно сохранены!');
            // возвращаем disabled для кнопки после успешной отправки
            this.userInfoForm.markAsPristine();
      },
          error: (errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            }else{
              this._snackBar.open('Ощибка сохранения!');
            }
          }
        });
    }



  }

}
