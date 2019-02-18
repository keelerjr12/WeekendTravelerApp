import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { ILocationData } from "./ILocationData";

@Injectable()
export class GeocodeService {

  constructor(private http: HttpClient) { }

  /*getLocationData(address: string): Observable<LocationData> {
    /*let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcode + "&units=imperial&mode=xml&appid=da6afaf045143ba75149312b1e70efc1";
    return this.http.get<Forecast>(weatherUrl, { responseType: 'text' }).subscribe(data => {
      console.log('testtest');
      console.log(data);
    });
    let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcode + "&units=imperial&mode=json&appid=da6afaf045143ba75149312b1e70efc1";
    return this.http.get<LocationData>(weatherUrl).pipe(map((res: any) => this.parseResponse(res)));
    
    let latLngUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=${" + address + "}&key=AIzaSyAKURpa8WrRHysyqCF5vGJrPOuI6G_hx80";
    return this.http.get<LocationData>(latLngUrl).pipe(map((response: any) => this.parseResponse(response)));
  }
  */

  public getLocationDataByAddress(address: string): Observable<ILocationData> {
    let addressUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=${" + address + "}&key=AIzaSyAKURpa8WrRHysyqCF5vGJrPOuI6G_hx80";
    return this.http.get<ILocationData>(addressUrl).pipe(map((response: any) => this.parseResponse(response)));
  }

  public getLocationDataByLatLng(point: google.maps.LatLng): Observable<ILocationData> {
    let latLngUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + point.lat() + "," + point.lng() + "&key=AIzaSyAKURpa8WrRHysyqCF5vGJrPOuI6G_hx80";
    return this.http.get<ILocationData>(latLngUrl).pipe(map((response: any) => this.parseResponse(response)));
  }

  private parseResponse(response: any): ILocationData {
    let lat = response.results[0].geometry.location.lat;
    let lng = response.results[0].geometry.location.lng;

    let locData: ILocationData = {
      address: response.results[0]["formatted_address"],
      coords: new google.maps.LatLng(lat, lng)
    };

    return locData;
  }
}
