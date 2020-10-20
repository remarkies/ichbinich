import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie";
import {PaintingModel} from "../models/painting.model";
import {PaintingComponent} from "../components/painting/painting.component";

@Injectable({
  providedIn: 'root'
})
export class CookieHandlerService {

  constructor(private cookieService: CookieService) { }

  public getBasket() {
    let cookie = this.cookieService.get('basket');

    if(cookie === '1') {
      return [];
    } else {
      return JSON.parse(cookie);
    }
  }

  public putBasket(basket: PaintingModel[]) {
    this.cookieService.put('basket', JSON.stringify(basket), { expires: this.getDateInAdvance(30) });
  }

  public removeFromBasket(painting: PaintingModel) {
    let basket = this.getBasket()

    const index = basket.findIndex(a => a.id === painting.id);

    if (index > -1) {
      basket.splice(index, 1);
    }
    this.putBasket(basket);
  }

  private getDateInAdvance(days: number) : Date {
    return new Date(new Date().getTime() + (days * (1000 * 60 * 60 * 24)));
  }
}
