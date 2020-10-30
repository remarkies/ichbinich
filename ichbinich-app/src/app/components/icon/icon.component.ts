import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input()
  public name: String;

  constructor() { }

  ngOnInit(): void {
  }

  public get path() : String {
    return "assets/icons/" + this.name + ".svg";
  }

}
