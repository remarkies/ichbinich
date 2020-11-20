import { Component, OnInit } from '@angular/core';
import {AddressModel} from "../../models/address.model";
import {PaintingModel} from "../../models/painting.model";
import {ApiService} from "../../services/api.service";
import {StripeService} from "ngx-stripe";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, Observable, Subscription} from "rxjs";
import {DataService} from "../../services/data.service";
import {KeyValueModel} from "../../models/keyValue.model";
import {TitleModel} from "../../models/title.model";
import {CountryModel} from "../../models/country.model";
import {Title} from "@angular/platform-browser";
import {map} from "rxjs/operators";


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  basketItems: PaintingModel[] = [];
  basketTotal: number = 0;
  private basketSubscription: Subscription;

  address: AddressModel;

  private addressSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private stripeService: StripeService,
              public dataService: DataService) { }

  ngOnInit(): void {
    this.basketSubscription = this.dataService.basket$.subscribe((basket) => {
      if(basket !== null) {
        this.basketItems = basket.items;
        this.basketTotal = this.dataService.calcBasketTotal(basket.items);
      }
    });

    this.addressSubscription = this.dataService.address$.subscribe(address => {
      this.address = address;
    });
  }

  pay(): void {
    this.apiService.createPaymentSession({
      items: this.dataService.basket.items.map(item => item.id)
    }).subscribe(response => {
      this.stripeService.redirectToCheckout({
        sessionId: response.id
      }).subscribe(result => {
        console.log(result);
      });
    });
  }
}
