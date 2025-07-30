import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, finalize, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {Router} from "@angular/router";
import {LoaderService} from "../../shared/services/loader.service";

// создаем интерсептор
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    //содаем constructor
    constructor(private authService: AuthService,//сразу при создании
                private router: Router,//для перевода пользователя на другую страницу
                private loaderService: LoaderService,//после создания Loader
    ) {
    }

    // прописываем intercept
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // после создания Loader добавляем его включение перед отправкой запроса на backend
      this.loaderService.show();

        // проверяем наличие token и access-token
        const tokens = this.authService.getTokens();
        if (tokens && tokens.accessToken) {
            // клонируем token из req в intercept
            const authReq = req.clone({
                headers: req.headers.set('x-access-token', tokens.accessToken)
            });
            //отправляем запрос с измененным access-token -
            //     return next.handle(authReq);
            //добавляем обработку ошибки 401 с отправкой при необходимости refresh-token
            return next.handle(authReq)
                .pipe(
                    // если ошибка появится, обрабатываем ее с помощью catchError
                    catchError((error) => {
                        // проверяем статус ошибки, и отсутствие в URL запроса login, и отсутствие в URL запроса refresh
                        if (error.status === '401' && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
                            // вызываем функцию обработки ошибки и передаем в нее измененный запрос и next
                            return this.handle401Error(authReq, next);
                        }
                        //     если ошибка не 401, возвращаем новую ошибку
                        return throwError(() => error);
                    }),
                //   добавляем закрытие Loader после завершения Observable без привязки к результату
                  finalize(() => this.loaderService.hide())
                );
        }
        //если access-token нет, то отправляем запрос существующий access-token
      //позже добавляем закрытие Loader через pipe
      //   return next.handle(req);
        return next.handle(req)
          .pipe( finalize(() => this.loaderService.hide()));
    }

//создаем метод для обработки 401 ошибки с вызовом функции получения refresh-token
    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.refresh()
            // промежуточная обработка результата с переключением на другой Observable
            .pipe(
                switchMap((result: DefaultResponseType | LoginResponseType) => {
                    //осуществляем сразу две проверки по типам возможной ошибки, создаем переменную без ошибки
                    let error = '';
                    // если ошибка данного типа, размещаем в ней сообщение от этого типа
                    if ((result as DefaultResponseType).error !== undefined) {
                        error = (result as DefaultResponseType).message;
                    }
                    // если ошибка не указанного выше типа, то размещаем в переменную результат и проверяем
                    // отсутствие токенов или пользователя
                    const refreshResult = result as LoginResponseType;
                    if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
                        error = 'Ошибка авторизации!';
                    }
                    //проверяем, если в ошибку что-то попало, то возвращаем Observable метод ошибки throwError
                    //с генерацией этой ошибки
                    if (error) {
                        return throwError(() => new Error(error));
                    }
                //если ошибки нет, то устанавливаем токены и отправляем новый запрос с добавлением нового
                // access-token
                    this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
                    const authReq = req.clone({
                        headers: req.headers.set('x-access-token', refreshResult.accessToken),
                    });
                // заново возвращаем запрос
                    return next.handle(authReq);
                }),
            //добавляем оператор для отлавливания ошибки при использовании .pipe, если ошибка произошла,
            //то удаляются токены и пользователь разлогинивается - переводится на страницу, возвращаем
                // Observable метод ошибки throwError с генерацией этой ошибки
                catchError(error =>{
                   this.authService.removeTokens();
                   this.router.navigate(['/']);
                   return throwError(()=> error);
                })
            )
    }
}
