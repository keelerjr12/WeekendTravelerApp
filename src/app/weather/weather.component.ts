import { Component } from '@angular/core';
import { FormControl } from "@angular/forms";
import { WeatherForecastServiceComponent } from "../../api/weather-forecast-service/weather-forecast-service.component";
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

  constructor(private forecastService: WeatherForecastServiceComponent) { }

  onSubmit() {
    let zipcode = this.zipcode.value;

    this.forecastService.getForecast(zipcode).subscribe(
      forecast => {
        this.forecast = forecast;
        console.log(forecast.getLocation());
        console.log(forecast.getDataPoints());
        /*let parser = new DOMParser();
        let xmldoc = parser.parseFromString(resp, "text/xml");

        console.log(xmldoc);

        this.location = xmldoc.getElementsByTagName("name")[0].innerHTML;

        this.data = [
          "test1",
          "test2",
          "test3"
      ];*/

        this.show = true;
      });
  }
}
