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
    InfoCircleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CookieModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
