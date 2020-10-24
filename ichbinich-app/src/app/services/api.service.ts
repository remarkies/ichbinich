import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {PaintingModel} from "../models/painting.model";

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

}
