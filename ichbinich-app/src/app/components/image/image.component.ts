import {Component, Input, OnInit} from '@angular/core';
import {PathModel} from "../../models/path.model";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input()
  public model: PathModel;

  constructor(public imageService: ImageService) { }

  ngOnInit(): void {
  }


}
