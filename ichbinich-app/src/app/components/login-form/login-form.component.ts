import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  public checkoutFormLogin: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.checkoutFormLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
  }

  public onLogin(data) {
    this.checkoutFormLogin.reset();
    console.log('Login as: ');
    console.log(data);
  }
}
