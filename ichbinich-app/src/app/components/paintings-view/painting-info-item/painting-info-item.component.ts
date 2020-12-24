import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-item',
  templateUrl: './painting-info-item.component.html',
  styleUrls: ['./painting-info-item.component.scss']
})
export class PaintingInfoItemComponent implements OnInit {

  constructor() { }

  @Input()
  public title: string;

  @Input()
  public description: string;

  ngOnInit(): void {
  }

}
