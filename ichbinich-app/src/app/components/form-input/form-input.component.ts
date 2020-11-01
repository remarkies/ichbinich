import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements OnInit {

  @Input()
  public id: string;

  @Input()
  public type: string;

  @Input()
  public label: string;

  @Input()
  public formName: string;

  @Input()
  public required: boolean = false;

  @Input()
  public formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  public inputChanged() {

    if (this.formGroup.dirty && this.formGroup.valid) {
      alert(
        `Name: ${this.formGroup.value.email} Email: ${this.formGroup.value.password}`
      );
    }
  }

}
