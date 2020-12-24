import {Component, Input, OnInit} from '@angular/core';
import {PaintingModel} from '../../../models/painting.model';
import {DataService} from '../../../services/data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-painting-info',
  templateUrl: './painting-info.component.html',
  styleUrls: ['./painting-info.component.scss']
})
export class PaintingInfoComponent implements OnInit {

  @Input()
  public painting: PaintingModel;
  private basketSubscription: Subscription;
  public isAlreadyInBasket = false;

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.basketSubscription = this.dataService.basket$.subscribe(basket => {
      this.isAlreadyInBasket = this.dataService.isItemAlreadyInBasket(basket, this.painting);
    });
  }

  get dimensions(): string {
    return this.painting.height + ' x ' + this.painting.width;
  }
  get price(): string {
    return 'CHF ' + this.painting.price + '.-';
  }

  get tags(): string[] {
    const tags = [];
    tags.push(this.painting.style);
    tags.push(this.painting.technique);
    tags.push(this.painting.underground);
    return tags;
  }

  addItemToBasket(painting: PaintingModel) {
    if (painting !== undefined && painting.id !== null && !this.isAlreadyInBasket) {
      this.dataService.addToBasket(painting.id);
      this.dataService.loadPaintings();
    }
  }
}
