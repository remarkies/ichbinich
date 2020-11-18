import {Component, Input, OnInit} from '@angular/core';
import {PaintingModel} from "../../models/painting.model";
import * as moment from 'moment';
import {CookieHandlerService} from "../../services/cookie-handler.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-painting-info',
  templateUrl: './painting-info.component.html',
  styleUrls: ['./painting-info.component.scss']
})
export class PaintingInfoComponent implements OnInit {

  @Input()
  public painting: PaintingModel;
  constructor(public dataService: DataService) { }

  ngOnInit(): void {

  }

  get dimensions() : string {
    return this.painting.height + ' x ' + this.painting.width + ' x ' + this.painting.depth;
  }
  get price() : string {
    return 'CHF ' + this.painting.price + '.-';
  }

  addItemToBasket(painting: PaintingModel) {
    if(painting.id !== null &&!this.dataService.isItemAlreadyInBasket(painting.id)) {
      this.dataService.addToBasket(painting.id);
    }
  }
}
