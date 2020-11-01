import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  public checkoutFormLogin: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.checkoutFormLogin = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
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
