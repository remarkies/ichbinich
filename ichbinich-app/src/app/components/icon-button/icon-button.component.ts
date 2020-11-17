import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {

  @Input()
  public isDisabled: boolean;

  @Input()
  public iconName: string;

  @Input()
  public iconSize: string = "x";

  @Output()
  public onClick = new EventEmitter<any>();

  onClickButton(event) {
    this.onClick.emit(event);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
