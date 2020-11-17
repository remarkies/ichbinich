import { Component, OnInit } from '@angular/core';
import {CookieHandlerService} from "../../services/cookie-handler.service";
import {Subscription} from "rxjs";
import {ApiService} from "../../services/api.service";
import {PathModel} from "../../models/path.model";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private cookieHandlerService: CookieHandlerService, private apiService: ApiService, private imageService: ImageService) { }
  private basketSubscription: Subscription;
  public basketCount: number;

  ngOnInit(): void {
    this.basketSubscription = this.cookieHandlerService.basket$.subscribe((basket) => {
      this.updateBasket();
    });
  }

  public updateBasket() {
    this.apiService.getPaintingsForCookieBasket(this.cookieHandlerService.basket).subscribe(items => {
      this.basketCount = items.length;
    });
  }



}
