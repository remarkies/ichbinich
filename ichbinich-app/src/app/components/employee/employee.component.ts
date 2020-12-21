import { Component, OnInit } from '@angular/core';
import {EmployeeModel} from '../../models/employee.model';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  currentEmployee: EmployeeModel;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    this.currentEmployee = this.authenticationService.currentEmployeeValue;
  }

  ngOnInit(): void {
  }

  logout(): void {
    console.log('logout');
    this.authenticationService.logout();
    this.router.navigate(['/user/login']);
  }
}
