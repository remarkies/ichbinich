import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-validator-info',
  templateUrl: './validator-info.component.html',
  styleUrls: ['./validator-info.component.scss']
})
export class ValidatorInfoComponent implements OnInit {

  @Input()
  public validationMessage: string;

  public isOk: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public get iconName() {
    return this.isOk? 'ok' : 'cross';
  }

}
