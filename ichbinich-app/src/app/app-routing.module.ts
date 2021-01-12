import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BasketComponent} from './views/basket/basket.component';
import {PaintingsComponent} from './views/paintings/paintings.component';
import {UserComponent} from './views/user/user.component';
import {CheckOutComponent} from './views/check-out/check-out.component';
import {AddressFormComponent} from './components/check-out/address-form/address-form.component';
import {SummaryComponent} from './components/check-out/summary/summary.component';
import {EmployeeComponent} from './components/admin/employee/employee.component';
import {AuthGuard} from './helpers/auth.guard';
import {LoginFormComponent} from './components/admin/login-form/login-form.component';
import {OrderComponent} from './components/admin/order/order.component';
import {EmployeePaintingComponent} from './components/admin/employee-painting/employee-painting.component';

const routes: Routes = [
  { path: '', component: PaintingsComponent},
  { path: 'basket', component: BasketComponent},
  { path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginFormComponent},
      { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard] },
      { path: 'order/:id', component: OrderComponent, canActivate: [AuthGuard] },
      { path: 'painting/:id', component: EmployeePaintingComponent, canActivate: [AuthGuard] },
      { path: '**', component: UserComponent }
    ],
    runGuardsAndResolvers: 'always',
  },
  { path: 'check-out', component: CheckOutComponent,
    children: [
      { path: 'address', component: AddressFormComponent},
      { path: 'summary', component: SummaryComponent},
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }










