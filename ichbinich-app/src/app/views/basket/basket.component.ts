import {Component, OnInit} from '@angular/core';
import {CookieHandlerService} from "../../services/cookie-handler.service";
import {PaintingModel} from "../../models/painting.model";
import {ApiService} from "../../services/api.service";
import {Subscription} from "rxjs";
import {CheckOutService} from "../../services/check-out.service";
import {StepOption} from "../../models/step.model";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  public basketItems: PaintingModel[] = [];
  public basketTotal: number = 0;

  private basketSubscription: Subscription;

  constructor(private apiService: ApiService, private cookieHandlerService: CookieHandlerService, private checkOutService: CheckOutService) { }

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

  private calcBasketTotal(basketItems: PaintingModel[]) : number {
    let total = 0;
    basketItems.forEach((item) => {
      total += item.price;
    });
    return total;
  }

  public checkOut() {
    this.checkOutService.basket = this.basketItems;
  }
}
