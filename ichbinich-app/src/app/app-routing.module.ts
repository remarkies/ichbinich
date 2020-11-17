import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BasketComponent} from "./views/basket/basket.component";
import {PaintingsComponent} from "./views/paintings/paintings.component";
import {UserComponent} from "./views/user/user.component";
import {CheckOutComponent} from "./views/check-out/check-out.component";
import {PageNotFoundComponent} from "./views/page-not-found/page-not-found.component";
import {AddressFormComponent} from "./components/address-form/address-form.component";
import {SummaryComponent} from "./components/summary/summary.component";

const routes: Routes = [
  { path: 'paintings', component: PaintingsComponent},
  { path: 'basket', component: BasketComponent},
  { path: 'user', component: UserComponent},
  { path: 'check-out', component: CheckOutComponent,
    children: [
      { path: 'address', component: AddressFormComponent},
      { path: 'summary', component: SummaryComponent},
    ]
  },
  { path: '',   redirectTo: '/paintings', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
