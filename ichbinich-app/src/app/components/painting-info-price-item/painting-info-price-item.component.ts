import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-painting-info-price-item',
  templateUrl: './painting-info-price-item.component.html',
  styleUrls: ['./painting-info-price-item.component.scss']
})
export class PaintingInfoPriceItemComponent implements OnInit {
  @Input()
  public title: string;

  @Input()
  public price: number;

  constructor() { }

  ngOnInit(): void {
  }

}
