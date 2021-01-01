import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CreatePaymentSessionRequestModel} from "../models/createPaymentSessionRequest.model";
import {StripeService} from "ngx-stripe";
import {BasketCookieModel} from "../models/basketCookie.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private apiService: ApiService, private stripeService: StripeService) { }

  public createPaymentSession(cookie: BasketCookieModel) {
    return this.apiService.createPaymentSession({ basketCookie: cookie });
  }
  public redirectToCheckout(sessionId: string) {
    return this.stripeService.redirectToCheckout({ sessionId: sessionId });
  }
  public checkPaymentStatus(sessionId: string) {
    return this.apiService.checkPaymentOfSession(sessionId);
  }
  public submitOrder(sessionId: string) {
    return this.apiService.submitOrder(sessionId);
  }
  public isOrderSubmitted(sessionId: string) {
    return this.apiService.isOrderSubmitted(sessionId);
  }


}
