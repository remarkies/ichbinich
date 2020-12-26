import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private basketSubscription: Subscription;
  public basketCount: number;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.basketSubscription = this.dataService.basket$.subscribe((basket) => {
      if(basket !== null) {
        this.basketCount = basket.items.length;
      }
    });
  }
}
