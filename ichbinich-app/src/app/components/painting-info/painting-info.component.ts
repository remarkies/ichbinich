import {Component, Input, OnInit} from '@angular/core';
import {PaintingModel} from "../../models/painting.model";

@Component({
  selector: 'app-painting-info',
  templateUrl: './painting-info.component.html',
  styleUrls: ['./painting-info.component.scss']
})
export class PaintingInfoComponent implements OnInit {

  @Input()
  public painting: PaintingModel;
  constructor() { }

  ngOnInit(): void {
  }

  public get dimensions() : string {
    return this.painting.height + ' x ' + this.painting.width + ' x ' + this.painting.depth;
  }

  public get price() : string {
    return 'CHF ' + this.painting.price + '.-';
  }
}
