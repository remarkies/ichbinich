import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {EmployeeOrderModel} from '../models/employeeOrder.model';
import {AuthenticationService} from './authentication.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {OrderStateModel} from '../models/orderState.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public get order$(): Observable<EmployeeOrderModel> {
    return this._order.asObservable();
  }
  public get order(): EmployeeOrderModel {
    return this._order.value;
  }
  private _order: BehaviorSubject<EmployeeOrderModel> = new BehaviorSubject<EmployeeOrderModel>(null);

  constructor(private apiService: ApiService, private authenticationService: AuthenticationService) { }

  public loadOrder(id: number): void {
    const currentEmployee = this.authenticationService.currentEmployeeValue;
    if (currentEmployee !== null) {
      this.apiService.getOrder(currentEmployee.token, id).subscribe(order => {
        this._order.next(order);
      });
    } else {
      console.log('Current employee not loaded.');
    }
  }
}
