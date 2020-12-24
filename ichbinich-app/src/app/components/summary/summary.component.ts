import { Component, OnInit } from '@angular/core';
import {AddressModel} from '../../models/address.model';
import {PaintingModel} from '../../models/painting.model';
import {ApiService} from '../../services/api.service';
import {StripeService} from 'ngx-stripe';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DataService} from '../../services/data.service';
import {PaymentService} from '../../services/payment.service';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  basketItems: PaintingModel[] = [];
  basketTotal = 0;
  private basketSubscription: Subscription;

  address: AddressModel;

  private addressSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private stripeService: StripeService,
              public dataService: DataService,
              private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.basketSubscription = this.dataService.basket$.subscribe((basket) => {
      if (basket !== null) {
        this.basketItems = basket.items;
        this.basketTotal = this.dataService.calcBasketTotal(basket.items);

        if (basket.stripe_session_id !== null) {
          this.paymentService.checkPaymentStatus(basket.stripe_session_id)
            .subscribe(status => {
              if (status.payment_status === 'paid') {
                this.paymentService.submitOrder(basket.stripe_session_id)
                  .subscribe(response => {
                    this.dataService.requestBasket();
                  });
              } else if (status.payment_status === 'unpaid') {
                console.log('oh no not paid yet');
              } else {
                console.log('dont know this payment status:', status.payment_status);
              }
            });
        }
      }
    });

    this.addressSubscription = this.dataService.address$.subscribe(address => {
      this.address = address;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      const success = params.success;

      if (success !== undefined && success) {
        this.dataService.loadPaintings();
        this.dataService.requestBasket();
        this.router.navigate(['/']);
      }
    });

  }

  pay(): void {
    this.paymentService.createPaymentSession(this.dataService.getBasketCookie())
      .subscribe(response => {
        this.paymentService.redirectToCheckout(response.id)
          .subscribe(result => {
            console.log(result);
          });
    });
  }
}
