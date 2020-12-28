import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/custom-elements/header/header.component';
import { PaintingComponent } from './components/paintings-view/painting/painting.component';
import { ImageComponent } from './components/paintings-view/image/image.component';
import { ImageGroupComponent } from './components/paintings-view/image-group/image-group.component';
import { PaintingInfoComponent } from './components/paintings-view/painting-info/painting-info.component';
import { PaintingInfoItemComponent } from './components/paintings-view/painting-info-item/painting-info-item.component';
import { ButtonComponent } from './components/form-controls/button/button.component';
import { IconComponent } from './components/custom-elements/icon/icon.component';
import { PaintingsComponent } from './views/paintings/paintings.component';
import { UserComponent } from './views/user/user.component';
import { BasketComponent } from './views/basket/basket.component';
import { InfoCircleComponent } from './components/custom-elements/info-circle/info-circle.component';
import { BasketItemComponent } from './components/basket/basket-item/basket-item.component';
import { IconButtonComponent } from './components/custom-elements/icon-button/icon-button.component';
import { CheckOutComponent } from './views/check-out/check-out.component';
import { ViewTitleComponent } from './components/custom-elements/view-title/view-title.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ValidatorInfoComponent } from './components/form-controls/validator-info/validator-info.component';
import { AddressFormComponent } from './components/check-out/address-form/address-form.component';
import { LoginFormComponent } from './components/admin/login-form/login-form.component';
import { FormHeaderComponent } from './components/form-controls/form-header/form-header.component';
import { FormInputComponent } from './components/form-controls/form-input/form-input.component';
import { FormSelectComponent } from './components/form-controls/form-select/form-select.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { SummaryComponent } from './components/check-out/summary/summary.component';
import {NgxStripeModule} from 'ngx-stripe';
import { EmployeeComponent } from './components/admin/employee/employee.component';
import { FooterComponent } from './components/custom-elements/footer/footer.component';
import { OrdersComponent } from './components/admin/orders/orders.component';
import { EmployeePaintingsComponent } from './components/admin/employee-paintings/employee-paintings.component';
import { OrderComponent } from './components/admin/order/order.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaintingComponent,
    ImageComponent,
    ImageGroupComponent,
    PaintingInfoComponent,
    PaintingInfoItemComponent,
    ButtonComponent,
    IconComponent,
    PaintingsComponent,
    UserComponent,
    BasketComponent,
    InfoCircleComponent,
    BasketItemComponent,
    IconButtonComponent,
    CheckOutComponent,
    ViewTitleComponent,
    ValidatorInfoComponent,
    AddressFormComponent,
    LoginFormComponent,
    FormHeaderComponent,
    FormInputComponent,
    FormSelectComponent,
    PageNotFoundComponent,
    SummaryComponent,
    EmployeeComponent,
    FooterComponent,
    OrdersComponent,
    EmployeePaintingsComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CookieModule.forRoot(),
    ReactiveFormsModule,
    NgxStripeModule.forRoot('pk_test_51HmkOLDUxivmNNIfUFH5IMY9eSpP8WLogw8d2gcjyGfybIpC3sonq5kdqfaRjQu4sgb3vDRoGhfujIxC0J1bXFPk00d4VdUq1n')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
