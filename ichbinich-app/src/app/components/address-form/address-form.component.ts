import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {TitleModel} from "../../models/title.model";
import {Subscription} from "rxjs";
import {CountryModel} from "../../models/country.model";
import {KeyValueModel} from "../../models/keyValue.model";

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {

  public titles: KeyValueModel[] = [];
  private titlesSubscription: Subscription;

  public countries: KeyValueModel[] = [];
  private countriesSubscription: Subscription;

  public checkoutFormAddress: FormGroup;

  constructor(private formBuilder: FormBuilder, private api: ApiService) {
    this.checkoutFormAddress = this.formBuilder.group({
      title: [''],
      firstName: ['', [Validators.required, Validators.email]],
      lastName: ['', [Validators.required, Validators.minLength(8)]],
      street: [''],
      streetNo: [''],
      postCode: [''],
      city: [''],
      country: [''],
      email: [''],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.titlesSubscription = this.api.getTitles().subscribe(titles => {
      let models: KeyValueModel[] = [];
      titles.forEach(title => {
        let model: KeyValueModel = {
          key: title.id,
          value: title.description
        };
        models.push(model);
      });
      this.titles = models;
    });

    this.countriesSubscription = this.api.getCountries().subscribe(countries => {
      let models: KeyValueModel[] = [];
      countries.forEach(country => {
        let model: KeyValueModel = {
          key: country.id,
          value: country.name
        };
        models.push(model);
      });
      this.countries = models;
    });
  }

  public next(data) {
    this.checkoutFormAddress.reset();
    console.log(data);
  }

}
