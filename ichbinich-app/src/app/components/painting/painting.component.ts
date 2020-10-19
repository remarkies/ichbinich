import {Component, Input, OnInit} from '@angular/core';
import {PaintingModel} from "../../models/painting.model";


@Component({
  selector: 'app-painting',
  templateUrl: './painting.component.html',
  styleUrls: ['./painting.component.scss']
})
export class PaintingComponent implements OnInit {

  @Input()
  public painting: PaintingModel;

  constructor() { }

  ngOnInit(): void {
  }

}
