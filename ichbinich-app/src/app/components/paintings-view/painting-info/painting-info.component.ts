import {Component, Input, OnInit} from '@angular/core';
import {PaintingModel} from '../../../models/painting.model';
import {DataService} from '../../../services/data.service';
import {Subscription} from 'rxjs';
import {RequestBasketResponseModel} from '../../../models/requestBasketResponse.model';

@Component({
  selector: 'app-painting-info',
  templateUrl: './painting-info.component.html',
  styleUrls: ['./painting-info.component.scss']
})
export class PaintingInfoComponent implements OnInit {

  public painting: PaintingModel;
  private paintingSubscription: Subscription;

  public basket: RequestBasketResponseModel;
  private basketSubscription: Subscription;

  public isPaintingInBasket = false;
  private isPaintingInBasketSubscription: Subscription;

  public isSold = false;

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.basketSubscription = this.dataService.basket$.subscribe(basket => {
      this.basket = basket;
    });

    this.paintingSubscription = this.dataService.selectedPainting$.subscribe(painting => {
      this.painting = painting;
      this.isSold = painting.sold > 0;
    });

    this.isPaintingInBasketSubscription = this.dataService.isSelectedPaintingInBasket$.subscribe(is =>{
      this.isPaintingInBasket = is;
    });
  }

  get tags(): string[] {
    const tags = [];
    tags.push(this.painting.style);
    tags.push(this.painting.technique);
    tags.push(this.painting.underground);
    return tags;
  }

  addItemToBasket(painting: PaintingModel) {
    if (painting !== undefined && painting.id !== null && !this.isPaintingInBasket) {
      this.dataService.addToBasket(painting.id);
    }
  }
}
