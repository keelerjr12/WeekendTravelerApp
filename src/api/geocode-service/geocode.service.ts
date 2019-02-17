import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { LocationData } from "./LocationData";

@Injectable()
export class GeocodeService {

  constructor(private http: HttpClient) { }

  getLocationData(address: string): Observable<LocationData> {
    /*let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcode + "&units=imperial&mode=xml&appid=da6afaf045143ba75149312b1e70efc1";
    return this.http.get<Forecast>(weatherUrl, { responseType: 'text' }).subscribe(data => {
      console.log('testtest');
      console.log(data);
    });
    let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcode + "&units=imperial&mode=json&appid=da6afaf045143ba75149312b1e70efc1";
    return this.http.get<LocationData>(weatherUrl).pipe(map((res: any) => this.parseResponse(res)));
    */
    let latLngUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=${" + address + "}&key=AIzaSyAKURpa8WrRHysyqCF5vGJrPOuI6G_hx80";
    return this.http.get<LocationData>(latLngUrl).pipe(map((response: any) => this.parseResponse(response)));
  }

  private parseResponse(response: any): LocationData {

    let lat = response.results[0].geometry.location.lat;
    let lng = response.results[0].geometry.location.lng;

    return new LocationData(lat, lng);
  }
}
