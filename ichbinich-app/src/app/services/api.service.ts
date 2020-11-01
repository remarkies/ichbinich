import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {PaintingModel} from "../models/painting.model";
import {TitleModel} from "../models/title.model";
import {CountryModel} from "../models/country.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getPaintings() {
    return this.http.get<PaintingModel[]>(environment.apiUrl + "/paintings");
  }

  public getPaintingsForCookieBasket(basket: number[]) {
    return this.http.post<PaintingModel[]>(environment.apiUrl + "/paintings/:ids", { ids: basket });
  }

  public getTitles() {
    return this.http.get<TitleModel[]>(environment.apiUrl + "/infos/titles");
  }

  public getCountries() {
    return this.http.get<CountryModel[]>(environment.apiUrl + "/infos/countries");
  }
}
