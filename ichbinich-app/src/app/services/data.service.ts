import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ApiService} from "./api.service";
import {CookieHandlerService} from "./cookie-handler.service";
import {UserModel} from "../models/user.model";
import {CookieOptionEnum} from "../models/cookieOption.enum";
import {PaintingModel} from "../models/painting.model";
import {AddressModel} from "../models/address.model";
import {TitleModel} from "../models/title.model";
import {CountryModel} from "../models/country.model";
import {BasketCookieModel} from "../models/basketCookie.model";
import {RequestBasketResponseModel} from "../models/requestBasketResponse.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public get basket$() : Observable<RequestBasketResponseModel>{
    return this._basket.asObservable();
  }
  public get basket() : RequestBasketResponseModel {
    return this._basket.value;
  }
  private _basket: BehaviorSubject<RequestBasketResponseModel> = new BehaviorSubject<RequestBasketResponseModel>(null);

  public get address$() : Observable<AddressModel> {
    return this._address.asObservable();
  }
  public get address() : AddressModel {
    return this._address.value;
  }
  private _address: BehaviorSubject<AddressModel> = new BehaviorSubject<AddressModel>(null);

  public get titles$() : Observable<TitleModel[]> {
    return this._titles.asObservable();
  }
  private _titles: BehaviorSubject<TitleModel[]> = new BehaviorSubject<TitleModel[]>([]);

  public get countries$() : Observable<CountryModel[]> {
    return this._countries.asObservable();
  }
  private _countries: BehaviorSubject<CountryModel[]> = new BehaviorSubject<CountryModel[]>([]);

  public userData: UserModel;

  private isUserLoggedIn: boolean = false;

  constructor(private apiService: ApiService, private cookieHandlerService: CookieHandlerService) {
    this.loadTitles();
    this.loadCountries();
    this.requestBasket();
  }

  private loadUserData() {
    if(this.isUserLoggedIn) {
      // server request for basket
    } else {
      // cookie request for basket
      this.userData = this.cookieHandlerService.loadCookie<UserModel>(CookieOptionEnum.User);
      if(this.userData === undefined || this.userData === null) {
        //this._basket.next([]);
        this._address.next(null);
      } else {
        //this._basket.next(this.userData.basket);
        this._address.next(this.userData.address);
      }
    }
  }
  private saveUserData() {
    if(this.isUserLoggedIn) {
      // server side save
    } else {
      this.cookieHandlerService.saveCookie(CookieOptionEnum.User, this.userData);
    }
  }

  private loadTitles() {
    this.apiService.getTitles().subscribe(titles => {
      this._titles.next(titles);
    });
  }
  private loadCountries() {
    this.apiService.getCountries().subscribe(countries => {
      this._countries.next(countries);
    });
  }

  // basket related
  public requestBasket() {
    // search for basket cookie
    const basketCookie = this.cookieHandlerService.loadCookie<BasketCookieModel>(CookieOptionEnum.Basket);
    this.apiService.requestBasket({ basketCookie: basketCookie }).subscribe(response => {
      // update basket
      this._basket.next(response);
      // set basket cookie
      this.cookieHandlerService.saveCookie(CookieOptionEnum.Basket, { id: response.id, version: 'v1' })
    });
  }

  public addToBasket(paintingId: number) {
    if(this.basket === null) {
      console.log('Basket not loaded properly.');
      return;
    }

    this.apiService.addToBasket({ basketId: this.basket.id, paintingId: paintingId })
      .subscribe(response => {
        this.requestBasket();
      });
  }

  public isItemAlreadyInBasket(id: number) : boolean {
    let found = false;
    this.basket.items.forEach((o) => {
      if(o.id === id) { found = true; }
    });
    return found;
  }
  public calcBasketTotal(items: PaintingModel[]) : number {
    let total = 0;
    items.forEach((item) => {
      total += item.price;
    });
    return total;
  }
  public removeFromBasket(id: number) {
    const index = this._basket.value.items.findIndex(a => a.id === id);
    if (index >= 0) {
      this._basket.value.items.splice(index, 1);
      this._basket.next(this._basket.value);
    }
    this.saveUserData();
  }

  // checkout related
  public saveAddress(address: AddressModel) {
    if(this.userData === undefined || this.userData === null) {
      this.userData = {
        basket: [],
        address: address
      };
    } else {
      this.userData.address = address;
    }
    this._address.next(this.userData.address);
    this.saveUserData();
  }
}
