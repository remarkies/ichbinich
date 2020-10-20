import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() { }

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



}
