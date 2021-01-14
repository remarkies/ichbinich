import { Component, OnInit } from '@angular/core';
import {AddressModel} from '../../../models/address.model';
import {PaintingModel} from '../../../models/painting.model';
import {ApiService} from '../../../services/api.service';
import {StripeService} from 'ngx-stripe';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DataService} from '../../../services/data.service';
import {PaymentService} from '../../../services/payment.service';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  basketItems: PaintingModel[] = [];
  basketTotal = 0;
  error = '';
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

        // recalculate basket total on change
        this.basketTotal = this.dataService.calcBasketTotal(basket.items);

        // check if user has pressed pay button before
        if (basket.stripe_session_id !== null) {
          // manual reload or redirect from stripe session happened

          // check if redirect from stripe session
          this.paymentService.checkPaymentStatus(basket.stripe_session_id)
            .subscribe(status => {

              // possible payment status: paid or unpaid
              if (status.payment_status === 'paid') {

                // server call to check if order is submitted
                this.paymentService.isOrderSubmitted(basket.stripe_session_id)
                  .subscribe(response => {

                    // avoid submitting order twice
                    if (!response.submitted) {

                      // submit order depending on checked stripe session
                      this.paymentService.submitOrder(basket.stripe_session_id)
                        .subscribe(() => {
                          // request new empty basket
                          this.dataService.requestBasket();
                          // reload paintings on main page
                          this.dataService.loadPaintings();
                          // navigate to main page
                          this.router.navigate(['/']);
                        });
                    }
                  });
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

      // if url contains success = true param
      if (success !== undefined && success) {
        // request basket results in update of basket subscription
        // order check happens
        this.dataService.requestBasket();
      }
    });
  }

  pay(): void {
    // every time user presses pay a new session with basket items get created
    this.paymentService.createPaymentSession(this.dataService.getBasketCookie())
      .subscribe(response => {

        // check for error
        if (response.error?.length > 0) {
          this.error = response.error;
          return;
        }

        // redirect to newly created stripe session
        this.paymentService.redirectToCheckout(response.id)
          .subscribe(() => {});
    });
  }
}
