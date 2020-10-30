import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BasketComponent} from "./views/basket/basket.component";
import {PaintingsComponent} from "./views/paintings/paintings.component";
import {UserComponent} from "./views/user/user.component";

const routes: Routes = [
  { path: 'paintings', component: PaintingsComponent},
  { path: 'basket', component: BasketComponent},
  { path: 'user', component: UserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
