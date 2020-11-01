import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from "@angular/common/http";
import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PaintingComponent } from './components/painting/painting.component';
import { PaintingListComponent } from './components/painting-list/painting-list.component';
import { ImageComponent } from './components/image/image.component';
import { ImageGroupComponent } from './components/image-group/image-group.component';
import { PaintingInfoComponent } from './components/painting-info/painting-info.component';
import { PaintingInfoItemComponent } from './components/painting-info-item/painting-info-item.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { ButtonComponent } from './components/button/button.component';
import { PaintingInfoPriceItemComponent } from './components/painting-info-price-item/painting-info-price-item.component';
import { IconComponent } from './components/icon/icon.component';
import { PaintingsComponent } from './views/paintings/paintings.component';
import { UserComponent } from './views/user/user.component';
import { BasketComponent } from './views/basket/basket.component';
import { InfoCircleComponent } from './components/info-circle/info-circle.component';
import { BasketItemComponent } from './components/basket/basket-item/basket-item.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { CheckOutComponent } from './views/check-out/check-out.component';
import { ViewTitleComponent } from './components/view-title/view-title.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ActionLinkComponent } from './components/action-link/action-link.component';
import { ValidatorInfoComponent } from './components/validator-info/validator-info.component';
import {ValidationService} from "./services/validation.service";
import { HoverMessageComponent } from './components/hover-message/hover-message.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { FormHeaderComponent } from './components/form-header/form-header.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaintingComponent,
    PaintingListComponent,
    ImageComponent,
    ImageGroupComponent,
    PaintingInfoComponent,
    PaintingInfoItemComponent,
    CurrencyComponent,
    ButtonComponent,
    PaintingInfoPriceItemComponent,
    IconComponent,
    PaintingsComponent,
    UserComponent,
    BasketComponent,
    InfoCircleComponent,
    BasketItemComponent,
    IconButtonComponent,
    CheckOutComponent,
    ViewTitleComponent,
    ActionLinkComponent,
    ValidatorInfoComponent,
    HoverMessageComponent,
    AddressFormComponent,
    LoginFormComponent,
    FormHeaderComponent,
    FormInputComponent,
    FormSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CookieModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [ValidationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
