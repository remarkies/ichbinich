import {Injectable} from '@angular/core';
import {AddressModel} from "../models/address.model";
import {PaintingModel} from "../models/painting.model";
import {CookieHandlerService} from "./cookie-handler.service";
import {CheckOutModel} from "../models/checkOut.model";
import {CookieOptionEnum} from "../models/cookieOption.enum";

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {

  public basket: PaintingModel[];

  public address: AddressModel;

  public checkOutData: CheckOutModel;

  constructor(private cookieHandlerService: CookieHandlerService) {
    this.checkOutData = this.loadCheckOutData();
  }

  private loadCheckOutData() : CheckOutModel {
    return {
      basket: [],
      address: this.cookieHandlerService.loadCookie<AddressModel>(CookieOptionEnum.address)
    }
  }
  private saveCheckOutData(model: CheckOutModel) : void {
    this.cookieHandlerService.saveCookie<CheckOutModel>(CookieOptionEnum.checkOut, model);
  }

  get basketIds() : number[] {
    return this.cookieHandlerService.basket;
  }
}
