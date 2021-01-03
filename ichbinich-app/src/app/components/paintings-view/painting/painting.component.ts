import {Component, Input, OnInit} from '@angular/core';
import {PaintingModel} from '../../../models/painting.model';


@Component({
  selector: 'app-painting',
  templateUrl: './painting.component.html',
  styleUrls: ['./painting.component.scss']
})
export class PaintingComponent implements OnInit {

  private _painting;

  get painting(): PaintingModel {
    return this._painting;
  }

  @Input()
  set painting(val: PaintingModel) {
    this._painting = val;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
