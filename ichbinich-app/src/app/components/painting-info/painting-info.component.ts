import {Component, Input, OnInit} from '@angular/core';
import {PaintingModel} from "../../models/painting.model";
import * as moment from 'moment';
import {CookieHandlerService} from "../../services/cookie-handler.service";
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-painting-info',
  templateUrl: './painting-info.component.html',
  styleUrls: ['./painting-info.component.scss']
})
export class PaintingInfoComponent implements OnInit {

  @Input()
  public painting: PaintingModel;
  constructor(private cookieHandlerService: CookieHandlerService, public uiService: UiService) { }

  ngOnInit(): void {

  }

  public get dimensions() : string {
    return this.painting.height + ' x ' + this.painting.width + ' x ' + this.painting.depth;
  }

  public get price() : string {
    return 'CHF ' + this.painting.price + '.-';
  }

  public addToCookieBasket(painting: PaintingModel) {
    let basket = this.cookieHandlerService.getBasket();

    if(!this.isAlreadyInBasket(basket)) {
      basket.push(painting);
      this.cookieHandlerService.putBasket(basket);
    }
  }

  public isAlreadyInBasket(painting: PaintingModel) : boolean {
    let basket = this.cookieHandlerService.getBasket();
    let found = false;
    basket.forEach((o) => {
      if(o.id === painting.id) {
        found = true;
      }
    });
    return found;
  }

}
