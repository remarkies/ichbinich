import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployeeModel} from '../../models/employee.model';
import {NavigationEnd, Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  currentEmployee: EmployeeModel;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentEmployee.subscribe(x => this.currentEmployee = x);
  }

  subdirect(): void {
    if (this.currentEmployee === null) {
      this.router.navigate(['/user/login']);
    } else {
      this.router.navigate(['/user/employee']);
    }
  }

  ngOnInit(): void {
    this.subdirect();
  }

}
