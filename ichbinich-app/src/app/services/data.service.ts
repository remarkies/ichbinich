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

  public get selectedPainting$(): Observable<PaintingModel>{
    return this._selectedPainting.asObservable();
  }
  public get selectedPainting(): PaintingModel {
    return this._selectedPainting.value;
  }
  private _selectedPainting: BehaviorSubject<PaintingModel> = new BehaviorSubject<PaintingModel>(null);

  public get isSelectedPaintingInBasket$(): Observable<boolean>{
    return this._isSelectedPaintingInBasket.asObservable();
  }
  public get isSelectedPaintingInBasket(): boolean {
    return this._isSelectedPaintingInBasket.value;
  }
  private _isSelectedPaintingInBasket: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  public loadPaintings(): void {
    this.apiService.getPaintings().subscribe(paintings => {
      this._paintings.next(paintings);
    });
  }
  private loadTitles(): void {
    this.apiService.getTitles().subscribe(titles => {
      this._titles.next(titles);
    });
  }
  private loadCountries(): void {
    this.apiService.getCountries().subscribe(countries => {
      this._countries.next(countries);
    });
  }

  public getBasketCookie(): BasketCookieModel {
    return this.cookieHandlerService.loadCookie<BasketCookieModel>(CookieOptionEnum.Basket);
  }

  // basket related
  public requestBasket(): void {
    // search for basket cookie
    const basketCookie = this.getBasketCookie();
    this.apiService.requestBasket({ basketCookie }).subscribe(response => {
      // update basket
      this._basket.next(response);

      if (this.selectedPainting !== null) {
        this._isSelectedPaintingInBasket.next(this.isItemAlreadyInBasket(this.selectedPainting));
      }

      // set basket cookie
      this.cookieHandlerService.saveCookie(CookieOptionEnum.Basket, { id: response.id, version: 'v1' });
    });
  }
  public addToBasket(paintingId: number): void {
    if (this.basket === null) {
      console.log('Basket not loaded properly.');
      return;
    }

    this.apiService.addToBasket({ basketId: this.basket.id, paintingId })
      .subscribe(response => {
        this.requestBasket();
      });
  }
  public isItemAlreadyInBasket(painting: PaintingModel): boolean {
    let found = false;

    if (this.basket !== null) {
      this.basket.items.forEach((o) => {
        if (o.id === painting.id) { found = true; }
      });
    }

    return found;
  }
  public calcBasketTotal(items: PaintingModel[]): number {
    let total = 0;
    items.forEach((item) => {
      total += item.price;
    });
    return total;
  }
  public removeFromBasket(paintingId: number): void {
    if (this.basket === null) {
      console.log('Basket not loaded properly.');
      return;
    }

    this.apiService.removeFromBasket({ basketId: this.basket.id, paintingId })
      .subscribe(response => {
        this.requestBasket();
      });
  }
  public requestAddressForBasket(): void {
    const basketCookie = this.getBasketCookie();
    this.apiService.requestAddressForBasket({ basketCookie}).subscribe( response => {
      if (response.status === 0) {
        this._address.next(response.address);
      } else {
        console.log(response.message);
      }
    });
  }
  public linkAddressToBasket(address: AddressModel): void {
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

  public nextPainting(): void {
    const index = this.paintings.indexOf(this.selectedPainting);
    if (index === this.paintings.length - 1) {
      this.selectPainting(this.paintings[0]);
    } else {
      this.selectPainting(this.paintings[index + 1]);
    }
  }
  public previousPainting(): void {
    const index = this.paintings.indexOf(this.selectedPainting);
    if (index === 0) {
      this.selectPainting(this.paintings[this.paintings.length - 1]);
    } else {
      this.selectPainting(this.paintings[index - 1]);
    }
  }
  public selectPainting(painting: PaintingModel): void {
    this._selectedPainting.next(painting);

    if (this.selectedPainting !== null) {
      this._isSelectedPaintingInBasket.next(this.isItemAlreadyInBasket(this.selectedPainting));
    }
  }
}
