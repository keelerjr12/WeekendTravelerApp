import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IsochroneMapComponent } from './isochrone-map/isochrone-map.component';
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from './home/home.component';
import { WeatherComponent } from './weather/weather.component';
import { WeatherForecastServiceComponent } from "../api/weather-forecast-service/weather-forecast-service.component";

@NgModule({
  declarations: [
    AppComponent,
    IsochroneMapComponent,
    HomeComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    WeatherForecastServiceComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
