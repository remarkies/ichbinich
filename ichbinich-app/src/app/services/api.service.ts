import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {PaintingModel} from '../models/painting.model';
import {TitleModel} from '../models/title.model';
import {CountryModel} from '../models/country.model';
import {CreatePaymentSessionRequestModel} from '../models/createPaymentSessionRequest.model';
import {CreatePaymentSessionResponseModel} from '../models/createPaymentSessionResponse.model';
import {RequestBasketRequestModel} from '../models/requestBasketRequest.model';
import {RequestBasketResponseModel} from '../models/requestBasketResponse.model';
import {BasketItemRequestModel} from '../models/basketItemRequest.model';
import {RequestAddressForBasketResponseModel} from '../models/requestAddressForBasketResponse.model';
import {NewAddressForBasketRequestModel} from '../models/newAddressForBasketRequest.model';
import {CheckPaymentOfSessionResponseModel} from '../models/checkPaymentOfSessionResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getPaintings() {
    return this.http.post<PaintingModel[]>(environment.apiUrl + '/paintings', null);
  }

  public requestBasket(requestBasketModel: RequestBasketRequestModel) {
    return this.http.post<RequestBasketResponseModel>(environment.apiUrl + '/basket/request', requestBasketModel);
  }
  public addToBasket(basketItemRequestModel: BasketItemRequestModel) {
    return this.http.post(environment.apiUrl + '/basket/add', basketItemRequestModel);
  }
  public removeFromBasket(basketItemRequestModel: BasketItemRequestModel) {
    return this.http.post(environment.apiUrl + '/basket/remove', basketItemRequestModel);
  }

  public requestAddressForBasket(requestBasketModel: RequestBasketRequestModel) {
    return this.http.post<RequestAddressForBasketResponseModel>(environment.apiUrl + '/address/request', requestBasketModel);
  }
  public isPaintingInBasket(basketId: number, paintingId: number) {
    return this.http.post<any>(environment.apiUrl + '/basket/itemExists', { basketId, paintingId });
  }

  public newAddressForBasket(model: NewAddressForBasketRequestModel) {
    return this.http.post(environment.apiUrl + '/address/new', model);
  }

  public checkPaymentOfSession(sessionId: string) {
    return this.http.post<CheckPaymentOfSessionResponseModel>(environment.apiUrl + '/payment/confirm', { stripe_session_id: sessionId });
  }
  public submitOrder(sessionId: string) {
    return this.http.post(environment.apiUrl + '/order/submit', { stripe_session_id: sessionId});
  }

  public getPaintingsForCookieBasket(basket: number[]) {
    return this.http.post<PaintingModel[]>(environment.apiUrl + '/paintings/:ids', { ids: basket });
  }

  public getTitles() {
    return this.http.get<TitleModel[]>(environment.apiUrl + '/infos/titles');
  }
  public getCountries() {
    return this.http.get<CountryModel[]>(environment.apiUrl + '/infos/countries');
  }

  public createPaymentSession(requestModel: CreatePaymentSessionRequestModel) {
    return this.http.post<CreatePaymentSessionResponseModel>(environment.apiUrl + '/payment/create-session', requestModel);
  }

  public isTokenValid(token: string) {
    return this.http.post<any>(environment.apiUrl + '/employees/isTokenValid', { token });
  }
}
