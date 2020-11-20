import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {TitleModel} from "../../models/title.model";
import {Subscription} from "rxjs";
import {CountryModel} from "../../models/country.model";

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {

  addressForm: FormGroup;
  submitted = false;

  titles: TitleModel[] = [];
  private titlesSubscription: Subscription;

  countries: CountryModel[] = [];
  private countriesSubscription: Subscription;

  private addressSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public dataService: DataService) { }

  ngOnInit(): void {
    this.titlesSubscription = this.dataService.titles$.subscribe(titles => {
      this.titles = titles;
    });

    this.countriesSubscription = this.dataService.countries$.subscribe(countries => {
      this.countries = countries;
    });

    this.addressSubscription = this.dataService.address$.subscribe(address => {
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
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.addressForm.controls; }

  onNext() {
    this.submitted = true;
    if (this.addressForm.invalid) { return; }

    this.dataService.linkAddressToBasket(this.addressForm.value);

    this.router.navigate(['/check-out/summary']);
  }

}
