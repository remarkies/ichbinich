import {BasketCookieModel} from "./basketCookie.model";
import {AddressModel} from "./address.model";

export interface NewAddressForBasketRequestModel {
  basketCookie: BasketCookieModel;
  address: AddressModel;
}
