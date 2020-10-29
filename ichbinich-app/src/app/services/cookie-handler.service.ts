import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CookieHandlerService {

  private _basket: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  public get basket$() : Observable<number[]>{
    return this._basket.asObservable();
  }
  public get basket() : number[] {
    return this._basket.value;
  }
  constructor(private cookieService: CookieService) {
    this.loadBasket();
  }

  private loadBasket() {
    let cookie = this.cookieService.get('basket');
    let basket = [];
    if(cookie !== undefined) {
      basket = JSON.parse(cookie);
    }
    this._basket.next(basket);
  }
  private saveBasket() {
    this.cookieService.put('basket', JSON.stringify(this.basket), { expires: this.getDateInAdvance(30) });
  }

  public addToBasket(painting_id: number) {
    this._basket.value.push(painting_id);
    this._basket.next(this._basket.value);
    this.saveBasket();
  }
  public removeFromBasket(item: number) {
    const index = this._basket.value.findIndex(a => a === item);

    if (index >= 0) {
      this._basket.value.splice(index, 1);
      this._basket.next(this._basket.value);
    }
    this.saveBasket();
  }
  public clear(): void {
    this._basket.next([]);
    this.saveBasket();
  }

  private getDateInAdvance(days: number) : Date {
    return new Date(new Date().getTime() + (days * (1000 * 60 * 60 * 24)));
  }
}
