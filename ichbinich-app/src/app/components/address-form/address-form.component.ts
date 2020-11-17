import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Subscription} from "rxjs";
import {KeyValueModel} from "../../models/keyValue.model";
import {CookieHandlerService} from "../../services/cookie-handler.service";
import {CheckOutService} from "../../services/check-out.service";
import {StepOption} from "../../models/step.model";
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {

  addressForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private cookieHandlerService: CookieHandlerService,
              private checkOutService: CheckOutService,
              private router: Router,
              public dataService: DataService) { }

  ngOnInit(): void {
    // load last entered address
    let address = this.cookieHandlerService.loadAddress();

    this.addressForm = this.formBuilder.group({
      title_id: [address !== null ? address.title_id : '', [Validators.required]],
      firstName: [address !== null ? address.firstName : '', [Validators.required]],
      lastName: [address !== null ? address.lastName : '', [Validators.required]],
      street: [address !== null ? address.street : '', [Validators.required]],
      streetNo: [address !== null ? address.streetNo : '', [Validators.required]],
      postalCode: [address !== null ? address.postalCode : '', [Validators.required]],
      city: [address !== null ? address.city : '', [Validators.required]],
      country_id: [address !== null ? address.country_id : '', [Validators.required]],
      email: [address !== null ? address.email : '', [Validators.required, Validators.email]],
      phone: [address !== null ? address.phone : '', [Validators.required]]
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.addressForm.controls; }

  onNext() {
    this.submitted = true;
    if (this.addressForm.invalid) { return; }

    // save address to cookies if user reload or something
    this.cookieHandlerService.saveAddress(this.addressForm.value);

    // save address to checkout service for later uses
    this.checkOutService.address = this.addressForm.value;

    this.router.navigate(['/check-out/summary']);
  }

}
