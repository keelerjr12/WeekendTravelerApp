import { Component } from '@angular/core';
import { FormControl } from "@angular/forms";
import { WeatherForecastService } from "../../api/weather-forecast-service/weather-forecast.service";
import { Forecast } from "../../api/weather-forecast-service/forecast";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {

  private zipcode = new FormControl('');
  private show = false;
  private forecast: Forecast;
  errorMessage: string;

  constructor(private forecastService: WeatherForecastService) { }

  onSubmit() {
    let zipcode = this.zipcode.value;

    this.forecastService.getForecast(zipcode).subscribe(
      forecast => {
        this.forecast = forecast;
        this.show = true;
      });
  }
}
