import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie";
import {CookieOptionEnum} from "../models/cookieOption.enum";

@Injectable({
  providedIn: 'root'
})
export class CookieHandlerService {

  constructor(private cookieService: CookieService) { }

  public loadCookie<T>(cookieOption: CookieOptionEnum) : T {
    let cookie = this.cookieService.get(CookieOptionEnum[cookieOption]);
    let model: T = null;
    if(cookie !== undefined) {
      model = JSON.parse(cookie);
    }
    return model;
  }
  public saveCookie<T>(cookieOption: CookieOptionEnum, model: T) : void {
    this.cookieService.put(CookieOptionEnum[cookieOption], JSON.stringify(model), { expires: this.getDateInAdvance(30) });
  }

  private getDateInAdvance(days: number) : Date {
    return new Date(new Date().getTime() + (days * (1000 * 60 * 60 * 24)));
  }
}
