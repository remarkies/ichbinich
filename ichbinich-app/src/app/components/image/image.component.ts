import {Component, Input, OnInit} from '@angular/core';
import {PathModel} from "../../models/path.model";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input()
  public model: PathModel;

  constructor() { }

  ngOnInit(): void {
  }

  public get fullPath() : string {
    return "/assets/images/" + this.model.path;
  }
}
