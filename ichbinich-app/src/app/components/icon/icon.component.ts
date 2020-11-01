import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input()
  public name: string;

  @Input()
  public size: string = "x";

  constructor() { }

  ngOnInit(): void {
  }

  public get path() : String {
    return "assets/icons/" + this.name + ".svg";
  }

  public getSizeClass() {
    switch (this.size) {
      case "x":
        return "sizeX";
      case "xs":
        return "sizeXS";
      default:
        return "sizeX";
    }
  }

}
