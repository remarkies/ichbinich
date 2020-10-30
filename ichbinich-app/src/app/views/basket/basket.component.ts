import { Component, OnInit } from '@angular/core';
import {CookieHandlerService} from "../../services/cookie-handler.service";
import {ImageService} from "../../services/image.service";
import {PathModel} from "../../models/path.model";
import {PaintingModel} from "../../models/painting.model";
import {ApiService} from "../../services/api.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  public basketItems: PaintingModel[] = [];
  public basketTotal: number = 0;

  private basketSubscription: Subscription;

  constructor(private apiService: ApiService, private cookieHandlerService: CookieHandlerService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.basketSubscription = this.cookieHandlerService.basket$.subscribe((basket) => {
      this.updateBasket();
    });
  }



  public updateBasket() {
    this.apiService.getPaintingsForCookieBasket(this.cookieHandlerService.basket).subscribe(items => {
      this.basketItems = items;
      this.basketTotal = this.calcBasketTotal(this.basketItems);
    });
  }

  public get basketInfo() {
    let count = this.cookieHandlerService.basket?.length;
    if(count === 0 || count === undefined) {
      return "warenkorb";
    } else {
      return "warenkorb(" + count + ")";
    }
  }

  public getImage(painting: PaintingModel) {
    if(painting.paths.length > 0) {
      return this.imageService.getFullPath(painting.paths[0])
    } else {
      return "";
    }
  }

  public removeFromBasket(id: number) {
    this.cookieHandlerService.removeFromBasket(id)
  }

  private calcBasketTotal(basketItems: PaintingModel[]) : number {
    let total = 0;
    basketItems.forEach((item) => {
      total += item.price;
    });
    return total;
  }

  public checkOut() {

  }
}
