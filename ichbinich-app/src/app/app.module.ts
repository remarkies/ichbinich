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
import { InfoItemComponent } from './components/info-item/info-item.component';
import { BasketComponent } from './components/basket/basket.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaintingComponent,
    PaintingListComponent,
    ImageComponent,
    ImageGroupComponent,
    PaintingInfoComponent,
    InfoItemComponent,
    BasketComponent
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
