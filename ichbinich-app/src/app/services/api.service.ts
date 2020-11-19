import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {PaintingModel} from "../models/painting.model";
import {TitleModel} from "../models/title.model";
import {CountryModel} from "../models/country.model";
import {CreatePaymentSessionRequestModel} from "../models/createPaymentSessionRequest.model";
import {CreatePaymentSessionResponseModel} from "../models/createPaymentSessionResponse.model";
import {BasketCookieModel} from "../models/basketCookie.model";
import {RequestBasketRequestModel} from "../models/requestBasketRequest.model";
import {RequestBasketResponseModel} from "../models/requestBasketResponse.model";
import {BasketItemRequestModel} from "../models/basketItemRequest.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getPaintings() {
    return this.http.get<PaintingModel[]>(environment.apiUrl + "/paintings");
  }

  public requestBasket(requestBasketModel: RequestBasketRequestModel) {
    return this.http.post<RequestBasketResponseModel>(environment.apiUrl + "/basket/request", requestBasketModel)
  }

  public addToBasket(basketItemRequestModel: BasketItemRequestModel) {
    return this.http.post(environment.apiUrl + "/basket/add", basketItemRequestModel);
  }

  public removeFromBasket(basketItemRequestModel: BasketItemRequestModel) {
    return this.http.post(environment.apiUrl + "/basket/remove", basketItemRequestModel);
  }

  public getPaintingsForCookieBasket(basket: number[]) {
    return this.http.post<PaintingModel[]>(environment.apiUrl + "/paintings/:ids", { ids: basket });
  }

  public getTitles() {
    return this.http.get<TitleModel[]>(environment.apiUrl + "/infos/titles");
  }

  public getCountries() {
    return this.http.get<CountryModel[]>(environment.apiUrl + "/infos/countries");
  }

  public createPaymentSession(requestModel: CreatePaymentSessionRequestModel) {
    return this.http.post<CreatePaymentSessionResponseModel>(environment.apiUrl + "/payment/create-session", requestModel)
  }
}
