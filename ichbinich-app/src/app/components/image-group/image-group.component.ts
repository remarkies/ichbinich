import {Component, Input, OnInit} from '@angular/core';
import {PathModel} from "../../models/path.model";

@Component({
  selector: 'app-image-group',
  templateUrl: './image-group.component.html',
  styleUrls: ['./image-group.component.scss']
})
export class ImageGroupComponent implements OnInit {

  @Input()
  public paths: PathModel[];

  public selectedPath: PathModel;

  constructor() { }

  ngOnInit(): void {

    // if painting has image
    if(this.paths?.length > 0) {
      // select first one
      this.selectedPath = this.paths[0];
    }

  }

  public selectImage(selectedPath) {
    this.selectedPath = selectedPath;
  }

}
