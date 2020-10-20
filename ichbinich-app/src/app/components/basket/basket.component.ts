import { Component, OnInit } from '@angular/core';
import {CookieHandlerService} from "../../services/cookie-handler.service";
import {ImageService} from "../../services/image.service";
import {PathModel} from "../../models/path.model";
import {PaintingModel} from "../../models/painting.model";
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  constructor(private cookieHandlerService: CookieHandlerService, private imageService: ImageService, public uiService: UiService) { }

  ngOnInit(): void {
  }

  public get basketList() {
    return this.cookieHandlerService.getBasket();
  }

  public get basketInfo() {
    let count = this.cookieHandlerService.getBasket().length;
    if(count === 0) {
      return "warenkorb";
    } else {
      return "warenkorb(" + count + ")";
    }
  }

  public getImage(painting: PaintingModel) {
    if(painting.paths.length > 0) {
      return this.imageService.getFullPath(painting.paths[0])
    } else {
      return "";
    }
  }
}
