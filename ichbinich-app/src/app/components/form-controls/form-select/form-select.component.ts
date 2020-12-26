import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {TitleModel} from "../../../models/title.model";
import {KeyValueModel} from "../../../models/keyValue.model";

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss']
})
export class FormSelectComponent implements OnInit {

  @Input()
  public id: string;

  @Input()
  public label: string;

  @Input()
  public formName: string;

  @Input()
  public list: KeyValueModel[] = [];

  @Input()
  public required: boolean = false;

  @Input()
  public formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
