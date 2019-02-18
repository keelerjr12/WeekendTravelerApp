import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Forecast } from "./forecast";
import { IForecastDataPoint } from "./IForecastDataPoint";

@Injectable()
export class WeatherForecastService {

  constructor(private http: HttpClient) { }

  getForecast(zipcode: string): Observable<Forecast> {
    let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcode + "&units=imperial&mode=json&appid=da6afaf045143ba75149312b1e70efc1";
    return this.http.get<Forecast>(weatherUrl).pipe(map((res: any) => this.parseResponse(res)));
  }

  private parseResponse(res: any): Forecast {
    let dPs: IForecastDataPoint[] = [];

    for (let point of res.list) {
      let newDP: IForecastDataPoint = {
        date: new Date(Number(point.dt) * 1000).toLocaleDateString(),
        time: new Date(Number(point.dt) * 1000).toLocaleTimeString(navigator.language,
          {
            hour: '2-digit',
            minute: '2-digit'
          }),
        temp: Number(point.main.temp.toFixed(0)),
        description: point.weather[0].description,
        icon: point.weather[0].icon + ".png"
    };
      console.log(newDP);
      dPs.push(newDP);
    }

    return new Forecast(res.city.name, res.city.country, dPs);
  }
}
