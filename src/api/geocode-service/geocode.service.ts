import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { ILocationData } from "./ILocationData";

@Injectable()
export class GeocodeService {

  constructor(private http: HttpClient) { }

  public getLocationDataByAddress(address: string): Observable<ILocationData> {
    let addressUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=${" + address + "}&key=AIzaSyAKURpa8WrRHysyqCF5vGJrPOuI6G_hx80";
    return this.http.get<ILocationData>(addressUrl).pipe(map((response: any) => this.parseJSONResponse(response)));
  }

  public getLocationDataByLatLng(point: google.maps.LatLng): Observable<ILocationData> {
    let latLngUrl = "https://maps.googleapis.com/maps/api/geocode/xml?latlng=" + point.lat() + "," + point.lng() + "&key=AIzaSyAKURpa8WrRHysyqCF5vGJrPOuI6G_hx80";
    return this.http.get(latLngUrl, {responseType: "text"}).pipe(map((response: any) => this.parseXMLResponse(response)));
  }

  private parseJSONResponse(response: any): ILocationData {
    let lat = response.results[0].geometry.location.lat;
    let lng = response.results[0].geometry.location.lng;

    let locData: ILocationData = {
      address: response.results[0]["formatted_address"],
      coords: new google.maps.LatLng(lat, lng)
    };

    return locData;
  }

  private parseXMLResponse(response: any): ILocationData {
    let parser = new DOMParser();
    let xmldoc = parser.parseFromString(response, "text/xml");

    let lat = Number(xmldoc.getElementsByTagName("location")[0].getElementsByTagName("lat")[0].innerHTML);
    let lng = Number(xmldoc.getElementsByTagName("location")[0].getElementsByTagName("lng")[0].innerHTML);
    let address = xmldoc.getElementsByTagName("formatted_address")[0].innerHTML;

    let locData: ILocationData = {
      address: address,
      coords: new google.maps.LatLng(lat, lng)
    };

    return locData;
  }
}
