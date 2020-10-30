import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-info-circle',
  templateUrl: './info-circle.component.html',
  styleUrls: ['./info-circle.component.scss']
})
export class InfoCircleComponent implements OnInit {

  @Input()
  public count: number;

  constructor() { }

  ngOnInit(): void {
  }
}
