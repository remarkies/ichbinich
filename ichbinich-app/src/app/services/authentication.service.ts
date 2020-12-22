import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {EmployeeModel} from '../models/employee.model';
import {environment} from '../../environments/environment';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentEmployeeSubject: BehaviorSubject<EmployeeModel>;
  public currentEmployee: Observable<EmployeeModel>;

  constructor(private http: HttpClient, private apiService: ApiService) {
    let localStorageObject = JSON.parse(localStorage.getItem('currentEmployee'));

    if (localStorageObject !== null) {
      apiService.isTokenValid(localStorageObject.token)
        .subscribe(response => {
          if (!response.valid) {
            localStorageObject = null;
          }
        });
    }

    this.currentEmployeeSubject = new BehaviorSubject<EmployeeModel>(localStorageObject);
    this.currentEmployee = this.currentEmployeeSubject.asObservable();
  }

  public get currentEmployeeValue(): EmployeeModel {
    return this.currentEmployeeSubject.value;
  }

  login(username, password): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/employees/authenticate`, { username, password })
      .pipe(map(employee => {
        // store Employee details and jwt token in local storage to keep Employee logged in between page refreshes
        localStorage.setItem('currentEmployee', JSON.stringify(employee));
        this.currentEmployeeSubject.next(employee);
        return employee;
      }));
  }

  logout(): void {
    // remove Employee from local storage and set current user to null
    localStorage.removeItem('currentEmployee');
    this.currentEmployeeSubject.next(null);
  }
}
