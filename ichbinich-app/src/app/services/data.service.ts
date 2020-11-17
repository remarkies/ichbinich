import { Injectable } from '@angular/core';
import {KeyValueModel} from "../models/keyValue.model";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {ApiService} from "./api.service";
import {CookieHandlerService} from "./cookie-handler.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public get basket$() : Observable<number[]>{
    return this._basket.asObservable();
  }
  public get basket() : number[] {
    return this._basket.value;
  }
  private _basket: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  public titles: KeyValueModel[] = [];
  private titlesSubscription: Subscription;

  public countries: KeyValueModel[] = [];
  private countriesSubscription: Subscription;

  constructor(private apiService: ApiService, private cookieHandlerService: CookieHandlerService) {
    this.loadTitles();
    this.loadCountries();
  }

  private loadBasket(userLoggedIn: boolean) {
    if(userLoggedIn) {
      // server request for basket
    } else {
      // cookie request for basket
      this.cookieHandlerService.loadCookie(Coo)

    }
  }

  private loadTitles() {
    this.titlesSubscription = this.apiService.getTitles().subscribe(titles => {
      let models: KeyValueModel[] = [];
      titles.forEach(title => {
        let model: KeyValueModel = {
          key: title.id,
          value: title.description
        };
        models.push(model);
      });
      this.titles = models;
    });
  }
  private loadCountries() {
    this.countriesSubscription = this.apiService.getCountries().subscribe(countries => {
      let models: KeyValueModel[] = [];
      countries.forEach(country => {
        let model: KeyValueModel = {
          key: country.id,
          value: country.name
        };
        models.push(model);
      });
      this.countries = models;
    });
  }

  public titleForId(id: number) : KeyValueModel {
    return this.titles.find(o => o.key === id);
  }
  public countryForId(id: number) : KeyValueModel {
    return this.countries.find(o => o.key === id);
  }

}
