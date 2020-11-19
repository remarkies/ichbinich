import {Component, OnInit} from '@angular/core';
import {PaintingModel} from "../../models/painting.model";
import {Subscription} from "rxjs";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  public basketItems: PaintingModel[] = [];
  public basketTotal: number = 0;

  private basketSubscription: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    this.basketSubscription = this.dataService.basket$.subscribe((basket) => {
      if(basket !== null) {
        this.basketItems = basket.items;
        this.basketTotal = this.dataService.calcBasketTotal(basket.items);
      }
    });
  }
}
