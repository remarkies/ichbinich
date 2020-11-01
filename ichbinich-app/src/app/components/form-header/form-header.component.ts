import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss']
})
export class FormHeaderComponent implements OnInit {

  @Input()
  public description: String;

  constructor() { }

  ngOnInit(): void {
  }

}
