import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-hover-message',
  templateUrl: './hover-message.component.html',
  styleUrls: ['./hover-message.component.scss']
})
export class HoverMessageComponent implements OnInit {

  @Input()
  public message: string;

  constructor() { }

  ngOnInit(): void {
  }

}
