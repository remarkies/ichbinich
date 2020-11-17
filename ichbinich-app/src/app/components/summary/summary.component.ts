import { Component, OnInit } from '@angular/core';
import {CheckOutService} from "../../services/check-out.service";
import {AddressModel} from "../../models/address.model";
import {PaintingModel} from "../../models/painting.model";
import {ApiService} from "../../services/api.service";
import { StripeService } from "ngx-stripe";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {CookieHandlerService} from "../../services/cookie-handler.service";
import {DataService} from "../../services/data.service";


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  public basketItems: PaintingModel[] = [];
  public basketTotal: number = 0;
  private basketSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              public checkOutService: CheckOutService,
              private stripeService: StripeService,
              private cookieHandlerService: CookieHandlerService,
              public dataService: DataService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      params =>{
        //this.courseId = (params['id']);
      }
    );

    this.basketSubscription = this.cookieHandlerService.basket$.subscribe((basket) => {
      this.updateBasket();
    });
  }

  pay(): void {
    this.apiService.createPaymentSession({
      items: this.checkOutService.basketIds
    }).subscribe(response => {
      this.stripeService.redirectToCheckout({
        sessionId: response.id
      })
        .subscribe(result => {
        console.log(result);
      });
    });
  }

  get selectedTitle() {
    return this.dataService.titleForId(Number(this.checkOutService.address.title_id)).value
  }
  get selectedCountry() {
    return this.dataService.countryForId(Number(this.checkOutService.address.country_id)).value
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
}
