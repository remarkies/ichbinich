import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm}]
})
export class FormInputComponent implements OnInit {

  @Input() id: string;
  @Input() inputType: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() validatorConfig : any = {};

  @Output() isFormValid = new EventEmitter<boolean>();
  @Output() output = new EventEmitter<string>();

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    console.log(this.validatorConfig)
    this.form = this.formBuilder.group(this.validatorConfig)
  }

  public onFocusOut() {
    const valid = this.form.valid;
    this.isFormValid.emit(valid);

    if(valid) {
      this.output.emit(this.form.value);
    }
  }
}
