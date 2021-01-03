import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label: string;
  @Input() isDisabled: boolean;
  @Input() type = 'button';
  @Input() iconLeft = false;
  @Input() iconRight = false;
  @Input() icon = '';
  @Input() iconSize = 'xs';
  @Input() disableBorders = false;

  @Output() onClick = new EventEmitter<any>();

  onClickButton(event): void {
    this.onClick.emit(event);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
