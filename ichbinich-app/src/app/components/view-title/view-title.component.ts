import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-view-title',
  templateUrl: './view-title.component.html',
  styleUrls: ['./view-title.component.scss']
})
export class ViewTitleComponent implements OnInit {

  @Input()
  public title: String;

  constructor() { }

  ngOnInit(): void {
  }

}
