import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiService} from './api.service';
import {CookieHandlerService} from './cookie-handler.service';
import {CookieOptionEnum} from '../models/cookieOption.enum';
import {PaintingModel} from '../models/painting.model';
import {AddressModel} from '../models/address.model';
import {TitleModel} from '../models/title.model';
import {CountryModel} from '../models/country.model';
import {BasketCookieModel} from '../models/basketCookie.model';
import {RequestBasketResponseModel} from '../models/requestBasketResponse.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public get paintings$(): Observable<PaintingModel[]>{
    return this._paintings.asObservable();
  }
  public get paintings(): PaintingModel[] {
    return this._paintings.value;
  }
  private _paintings: BehaviorSubject<PaintingModel[]> = new BehaviorSubject<PaintingModel[]>(null);

  public get basket$(): Observable<RequestBasketResponseModel>{
    return this._basket.asObservable();
  }
  public get basket(): RequestBasketResponseModel {
    return this._basket.value;
  }
  private _basket: BehaviorSubject<RequestBasketResponseModel> = new BehaviorSubject<RequestBasketResponseModel>(null);

  public get address$(): Observable<AddressModel> {
    return this._address.asObservable();
  }
  public get address(): AddressModel {
    return this._address.value;
  }
  private _address: BehaviorSubject<AddressModel> = new BehaviorSubject<AddressModel>(null);

  public get titles$(): Observable<TitleModel[]> {
    return this._titles.asObservable();
  }
  private _titles: BehaviorSubject<TitleModel[]> = new BehaviorSubject<TitleModel[]>([]);

  public get countries$(): Observable<CountryModel[]> {
    return this._countries.asObservable();
  }
  private _countries: BehaviorSubject<CountryModel[]> = new BehaviorSubject<CountryModel[]>([]);

  constructor(private apiService: ApiService, private cookieHandlerService: CookieHandlerService) {
    this.loadPaintings();
    this.loadTitles();
    this.loadCountries();
    this.requestBasket();
    this.requestAddressForBasket();
  }
  public loadPaintings() {
    this.apiService.getPaintings().subscribe(paintings => {
      this._paintings.next(paintings);
    });
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

  public getBasketCookie() {
    return this.cookieHandlerService.loadCookie<BasketCookieModel>(CookieOptionEnum.Basket);
  }

  // basket related
  public requestBasket() {
    // search for basket cookie
    const basketCookie = this.getBasketCookie();
    this.apiService.requestBasket({ basketCookie }).subscribe(response => {
      // update basket
      this._basket.next(response);
      // set basket cookie
      this.cookieHandlerService.saveCookie(CookieOptionEnum.Basket, { id: response.id, version: 'v1' });
    });
  }
  public addToBasket(paintingId: number) {
    if (this.basket === null) {
      console.log('Basket not loaded properly.');
      return;
    }

    this.apiService.addToBasket({ basketId: this.basket.id, paintingId })
      .subscribe(response => {
        this.requestBasket();
      });
  }
  public isItemAlreadyInBasket(basket: RequestBasketResponseModel, painting: PaintingModel): boolean {
    let found = false;
    basket.items.forEach((o) => {
      if (o.id === painting.id) { found = true; }
    });
    return found;
  }
  public calcBasketTotal(items: PaintingModel[]): number {
    let total = 0;
    items.forEach((item) => {
      total += item.price;
    });
    return total;
  }
  public removeFromBasket(paintingId: number) {
    if (this.basket === null) {
      console.log('Basket not loaded properly.');
      return;
    }

    this.apiService.removeFromBasket({ basketId: this.basket.id, paintingId })
      .subscribe(response => {
        this.requestBasket();
      });
  }
  public requestAddressForBasket() {
    const basketCookie = this.getBasketCookie();
    this.apiService.requestAddressForBasket({ basketCookie}).subscribe( response => {
      if (response.status === 0) {
        this._address.next(response.address);
      } else {
        console.log(response.message);
      }
    });
  }
  public linkAddressToBasket(address: AddressModel) {
    if (this.basket === null) {
      console.log('Basket not loaded properly.');
      return;
    }
    const basketCookie = this.getBasketCookie();
    this.apiService.newAddressForBasket({
      basketCookie,
      address
    }).subscribe(() => {
      this.requestAddressForBasket();
    });

  }
}
