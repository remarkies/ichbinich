import {Component, Input, OnInit} from '@angular/core';
import {PaintingModel} from "../../../models/painting.model";
import {ImageService} from "../../../services/image.service";
import {CookieHandlerService} from "../../../services/cookie-handler.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.scss']
})
export class BasketItemComponent implements OnInit {

  @Input()
  public item: PaintingModel;

  @Input()
  public size: string;

  constructor(private imageService: ImageService, public dataService: DataService) { }

  ngOnInit(): void {
  }

  public getImage(painting: PaintingModel) {
    if(painting.paths.length > 0) {
      return this.imageService.getFullPath(painting.paths[0])
    } else {
      return "";
    }
  }
}
