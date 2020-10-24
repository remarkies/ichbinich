import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label: string;
  @Input() isDisabled: boolean;
  @Output() onClick = new EventEmitter<any>();

  onClickButton(event) {
    this.onClick.emit(event);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
