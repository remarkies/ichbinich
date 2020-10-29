import {Component, Input, OnInit} from '@angular/core';
import {PaintingModel} from "../../models/painting.model";
import * as moment from 'moment';
import {CookieHandlerService} from "../../services/cookie-handler.service";

@Component({
  selector: 'app-painting-info',
  templateUrl: './painting-info.component.html',
  styleUrls: ['./painting-info.component.scss']
})
export class PaintingInfoComponent implements OnInit {

  @Input()
  public painting: PaintingModel;
  constructor(private cookieHandlerService: CookieHandlerService) { }

  ngOnInit(): void {

  }

  public get dimensions() : string {
    return this.painting.height + ' x ' + this.painting.width + ' x ' + this.painting.depth;
  }

  public get price() : string {
    return 'CHF ' + this.painting.price + '.-';
  }

  public addToCookieBasket(painting: PaintingModel) {
    if(painting.id !== null &&!this.isAlreadyInBasket(painting)) {
      this.cookieHandlerService.addToBasket(painting.id);
    }
  }

  public isAlreadyInBasket(painting: PaintingModel) : boolean {
    let basket = this.cookieHandlerService.basket;
    let found = false;
    basket.forEach((o) => {
      if(o === painting.id) {
        found = true;
      }
    });
    return found;
  }

}
