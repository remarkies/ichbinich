import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
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
import {CheckPaymentOfSessionResponseModel} from '../models/checkPaymentOfSessionResponse.model';
import {BasketCookieModel} from '../models/basketCookie.model';
import {AddressModel} from '../models/address.model';

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

  public newAddressForBasket(basketCookie: BasketCookieModel, address: AddressModel): any {
    return this.http.post<any>(environment.apiUrl + '/address/new', { basketCookie, address});
  }

  public checkPaymentOfSession(sessionId: string) {
    return this.http.post<CheckPaymentOfSessionResponseModel>(environment.apiUrl + '/payment/confirm', { stripe_session_id: sessionId });
  }

  public isOrderSubmitted(sessionId: string): any {
    return this.http.post<any>(environment.apiUrl + '/order/isOrderSubmitted', { stripe_session_id: sessionId });
  }

  public submitOrder(sessionId: string): any {
    return this.http.post<any>(environment.apiUrl + '/order/submit', { stripe_session_id: sessionId});
  }

  public getPaintingsForCookieBasket(basket: number[]) {
    return this.http.post<PaintingModel[]>(environment.apiUrl + '/paintings/:ids', { ids: basket });
  }

  public getTitles() {
    return this.http.get<TitleModel[]>(environment.apiUrl + '/address/titles');
  }
  public getCountries() {
    return this.http.get<CountryModel[]>(environment.apiUrl + '/address/countries');
  }

  public createPaymentSession(requestModel: CreatePaymentSessionRequestModel) {
    return this.http.post<CreatePaymentSessionResponseModel>(environment.apiUrl + '/payment/create-session', requestModel);
  }

  public isTokenValid(token: string): any {
    return this.http.post<any>(environment.apiUrl + '/employees/isTokenValid', { token });
  }

  public getOrders(token: string): any {
    return this.http.post<any>(environment.apiUrl + '/orders/get', {token});
  }

  public getOrder(token: string, id: number): any {
    return this.http.post<any>(environment.apiUrl + '/orders/order', {token, id});
  }

  public markOrderAsSent(token: string, id: number, email: string): any {
    return this.http.post<any>(environment.apiUrl + '/orders/markAsSent', {token, id, email});
  }

  public getPainting(id: number): any {
    return this.http.post<any>(environment.apiUrl + '/paintings/painting', {id});
  }

  public getStyles(): any {
    return this.http.get<any>(environment.apiUrl + '/paintings/styles');
  }

  public getTechniques(): any {
    return this.http.get<any>(environment.apiUrl + '/paintings/techniques');
  }

  public getUndergrounds(): any {
    return this.http.get<any>(environment.apiUrl + '/paintings/undergrounds');
  }

  public getCollections(): any {
    return this.http.get<any>(environment.apiUrl + '/paintings/collections');
  }

  public updatePainting(token: string, painting: PaintingModel): any {
    return this.http.post<any>(environment.apiUrl + '/paintings/update', { token, painting });
  }

  public addPainting(token: string, painting: PaintingModel): any {
    return this.http.post<any>(environment.apiUrl + '/paintings/add', { token, painting });
  }

  public deleteImage(token: string, id: number): any {
    return this.http.post<any>(environment.apiUrl + '/images/delete', {token, id});
  }

  public uploadImage(token: string, id: number, file: File): any {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('token', token);
    formData.append('id', id.toString());

    return this.http.post<any>(environment.apiUrl + '/images/upload', formData);
  }
}
