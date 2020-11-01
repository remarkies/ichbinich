import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-action-link',
  templateUrl: './action-link.component.html',
  styleUrls: ['./action-link.component.scss']
})
export class ActionLinkComponent implements OnInit {

  @Input()
  public text: string;

  @Input()
  public link: string;

  constructor() { }

  ngOnInit(): void {
  }

}
