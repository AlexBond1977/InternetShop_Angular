import {Injectable} from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // создаем переменные ключей для хранения данных авторизации, чтобы не ошибиться в строковых значениях
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  // создаем subject isLogged для использования в header и отслеживания состояния авторизации и переменную с
  // аналогичным названием для хранения состояния авторизации в моменте
  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    //   проверяем, авторизован пользователь или нет, и закрепляем данный статус при работе приложения,
    //   используем !! для приведения результата к типу boolean
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

//   запрос на авторизацию (login) с возвращением Observable-объекта созданных типов
//   DefaultResponseType или LoginResponseType - возвращается URL-адрес и объект с
//   параметрами email, password, rememberMe
  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    })
  }

 //  запрос на регистрацию по аналогии с запросом на авторизацию - программа Postman возвращает
 //  те же типы данных + необязательные name и lastName
 signup(email: string, password: string, passwordRepeat: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      email, password, passwordRepeat
    })
  }

//   метод для разлогинивания - создается после методов авторизации, написанных ниже!!!
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken){
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken,
      })
    }
    throw throwError(()=> 'Can not find token!');
  }

//метод для получения refresh-token - создается при создании auth.interceptor.ts для обработки 401 ошибки,
//метод будет либо возвращать ошибку, либо токены авторизованного пользователя
  refresh(): Observable<DefaultResponseType | LoginResponseType> {
  //   получаем токены, проверяем, если они есть и в них refreshToken, то используем его для получения
    //   новой пары токенов, иначе ошибка
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken){
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      })
    }
    throw throwError(()=> 'Can not use token!');
  }

//   метод для получения свойства авторизации пользователя
  public getIsLoggedIn() {
    return this.isLogged;
  }

//   метод для установки токенов, меняем свойство авторизации на true, уведомляем об его изменении
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

//   метод для удаления токенов по ключу, меняем свойство авторизации на false, уведомляем об его изменении
  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

//   метод получения токенов в виде объекта
  getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    }
  }

//   геттер для получения userId и сеттер для его сохранения в localStorage
  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }
  set userId(id: null | string) {
    if(id){
      localStorage.setItem(this.userIdKey, id);
    }else{
      localStorage.removeItem(this.userIdKey);
    }
  }

}
