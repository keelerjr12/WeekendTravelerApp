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
  address = new FormControl('');
  hours = new FormControl('');
  mins = new FormControl('');

  origin: google.maps.LatLng;

  errorMessage: string;

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

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
    let address = this.address.value;

    this.geocodeService.getLocationData(address).subscribe(
      locationData => {

        this.origin = new google.maps.LatLng(locationData.getLat(), locationData.getLng());
        this.map.setCenter(this.origin);

        let hours = this.hours.value;
        let mins = this.mins.value;
        let maxTime = (hours * 60) + mins;
        this.isochroneService.generateIsochrone(locationData, maxTime).subscribe(
          outCoords => {

            var isochronePoly = new google.maps.Polygon({
              paths: outCoords,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35
            });

            google.maps.event.addListener(isochronePoly,
              'click',
              function (event) {
                //service = new google.maps.places.PlacesService(map);
                //infoWindow = new google.maps.InfoWindow();
                var location = {
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng()
                };
                console.log(location);
              });

            isochronePoly.setMap(this.map);
          });
        });
     // },
      //error => this.errorMessage = <any>error);
  }
}
