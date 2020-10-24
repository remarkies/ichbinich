import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  @Input()
  private value: number;

  constructor() { }

  ngOnInit(): void {
  }

  public formatValueToCurrency(value: number) {
    let formatter = new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0,
      //maximumFractionDigits: 0,
    });
    return formatter.format(value);
  }

  public get getValue() {
    return this.formatValueToCurrency(this.value)
  }
}
