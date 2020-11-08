import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule} from '@angular/forms';
import { SimulatorsComponent } from './simulators/simulators.component';
import { ClientComponent } from './client/client.component'
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from './client.service';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';





@NgModule({
  declarations: [
    AppComponent,
    SimulatorsComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut:1000,
      progressBar:true,
    }),
    MatSliderModule,
    MatFormFieldModule,
    MatTabsModule,
    // MatInputModule


  ],
  providers: [ClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
