import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Forecast } from "./forecast";
import { IForecastDataPoint } from "./IForecastDataPoint";

@Injectable()
export class WeatherForecastServiceComponent {

  constructor(private http: HttpClient) { }

  getForecast(zipcode: string): Observable<Forecast> {
    /*let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcode + "&units=imperial&mode=xml&appid=da6afaf045143ba75149312b1e70efc1";
    return this.http.get<Forecast>(weatherUrl, { responseType: 'text' }).subscribe(data => {
      console.log('testtest');
      console.log(data);
    });*/
    let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcode + "&units=imperial&mode=json&appid=da6afaf045143ba75149312b1e70efc1";
    return this.http.get<Forecast>(weatherUrl).pipe(map((res: any) => this.parseResponse(res)));
  }

  private parseResponse(res: any): Forecast {
    let newDP = {
      temp: res.list[0].main.temp
    };

    let dPs = new Array<IForecastDataPoint>();
    dPs.push(newDP);

    return new Forecast(res.city.name, res.city.country, dPs);
  }
}
