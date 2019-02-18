/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { GeocodeService } from "../../api/geocode-service/geocode.service";
import { IsochroneService } from "../../api/isochrone-service/isochrone.service";

@Component({
  selector: 'isochrone-map',
  templateUrl: './isochrone-map.component.html',
  styleUrls: ['./isochrone-map.component.css']
})
export class IsochroneMapComponent implements OnInit {
  private address = new FormControl('');
  private hours = new FormControl('');
  private mins = new FormControl('');

  @ViewChild('gmap') gmapElement: any;
  private map: google.maps.Map;

  constructor(private geocodeService: GeocodeService, private isochroneService: IsochroneService) { }

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(38.5, -97.0),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  onSubmit() {
    this.geocodeService.getLocationDataByAddress(this.address.value).subscribe(
      location => {
        this.renderOrigin(location.coords);
        this.renderIsochrone(location.coords);
      }
    );
  }

  private renderOrigin(origin: google.maps.LatLng) {
    this.map.setCenter(origin);
    this.map.setZoom(8);
    let marker = new google.maps.Marker({
      position: origin,
      map: this.map
    });
  }

  private renderIsochrone(origin: google.maps.LatLng) {
    let maxTime = this.computeMaxTime();

    this.isochroneService.generateIsochrone(origin, maxTime).subscribe(
      outCoords => {
        let isochronePoly = this.createPolygon(outCoords);
        isochronePoly.setMap(this.map);
      }
    );
  }

  private computeMaxTime(): number {
    let maxTime = (this.hours.value * 60) + this.mins.value;
    return maxTime;
  }

  private marker: google.maps.Marker;

  private createPolygon(coords: google.maps.LatLng[]): google.maps.Polygon {
    var poly = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });

    google.maps.event.addListener(poly,
      'click',
      event => {
        this.geocodeService.getLocationDataByLatLng(event.latLng).subscribe(
          location => {

            if (this.marker !== undefined) {
              this.marker.setMap(null);
            }

            this.marker = new google.maps.Marker({
              position: location.coords,
              map: this.map,
            });

            let infoWindow = new google.maps.InfoWindow(
              {
                content: "<h4>" + location.address +"</h4><p>" + location.coords.lat().toFixed(4) + ", " + location.coords.lng().toFixed(4) + "</p>"
              });
            infoWindow.open(this.map, this.marker);
          });
      });

    return poly;
  }
}
