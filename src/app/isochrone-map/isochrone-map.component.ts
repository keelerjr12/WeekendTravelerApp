/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'isochrone-map',
  templateUrl: './isochrone-map.component.html',
  styleUrls: ['./isochrone-map.component.css']
})
export class IsochroneMapComponent implements OnInit {
  address = new FormControl('');
  hours = new FormControl('');
  mins = new FormControl('');

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(38.5, -97.0),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  origin: google.maps.LatLng;

  errorMessage: string;

  getCoordsFromAddress(address: string): Observable<any> {
    let latLngUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=${" + address + "}&key=AIzaSyAKURpa8WrRHysyqCF5vGJrPOuI6G_hx80";
    return this.http.get<any>(latLngUrl).pipe(tap(data => console.log('All: ' + JSON.stringify(data))), catchError(this.handleError));
  }

  onSubmit() {
    let address = this.address.value;

    this.getCoordsFromAddress(address).subscribe(
      resp => {
        let coords = resp["results"][0]["geometry"]["location"];
        this.origin = new google.maps.LatLng(coords.lat, coords.lng);
        this.map.setCenter(this.origin);

        let hours = this.hours.value;
        let mins = this.mins.value;
        let maxTime = (hours * 60) + mins;
        let eligibleCoords = this.computeEligibleCoords(maxTime);

        // DEBUGGING
        this.printDebuggingMarkers(eligibleCoords);

        this.getIsochrones(this.origin, eligibleCoords)
          .then(result => {
            let validCoords = [];

            for (let i = 0; i < result.length; i++) {
              let maxI = 0;
              let maxJ = 0;

              for (let j = 0; j < result[i]["resp"].rows[0].elements.length; j++) {
                if (result[i]["resp"].rows[0].elements[j].status === 'OK') {

                  var travelTime = result[i]["resp"].rows[0].elements[j].duration.value / 60;

                  if (travelTime <= (maxTime * 1.05)) {
                    maxI = i;
                    maxJ = j;
                  }
                }
              }
              validCoords.push(eligibleCoords[maxI][maxJ]);
            }

            let polarCoordCoords = [];

            for (let i = 0; i < validCoords.length; i++) {
              let lat = validCoords[i].lat - origin["lat"];
              let lng = validCoords[i].lng - origin["lng"];

              let degs = Math.atan2(lng, lat);

              var coordWithDegs =
              {
                coord: validCoords[i],
                degs: degs
              }

              polarCoordCoords.push(coordWithDegs);
            }

            polarCoordCoords.sort(sortIncreasing);

            function sortIncreasing(a, b) {
              if (a.degs < b.degs) {
                return -1;
              } else if (a.degs > b.degs) {
                return 1;
              }

              return 0;
            }

            let outCoords = [];
            for (let i = 0; i < polarCoordCoords.length; i++) {
              outCoords.push(polarCoordCoords[i].coord);
            }

            // Construct the polygon.

            var isochronePoly = new google.maps.Polygon({
              paths: outCoords,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35
            });

            isochronePoly.setMap(this.map);
          });
      },
      error => this.errorMessage = <any>error);
  }

  private computeEligibleCoords(maxTimeInMinutes: number): any[] {
    let speed = (60 / 60);
    let maxDistance = maxTimeInMinutes * speed;

    let eligibleCoords = [];
    let distanceInterval = maxDistance / 12;

    let maxNumberOfSlices = 8;
    let sliceInterval = 360 / maxNumberOfSlices;
    for (let slice = 0; slice < 360; slice += sliceInterval) {
      let sliceOfCoords = [];

      for (let distance = distanceInterval; distance <= maxDistance; distance += distanceInterval) {
        let latDist = distance * Math.cos(slice * Math.PI / 180);
        let longDist = distance * Math.sin(slice * Math.PI / 180);

        let lat = this.origin.lat() + this.computeLatitudinalShiftByDistance(latDist);
        let lng = this.origin.lng() + this.computeLongitudinalShiftAtLatitudeByDistance(this.origin.lat(), longDist);


        let point = { distance, latDist, longDist, lat, lng };
        sliceOfCoords.push(point);
      }

      eligibleCoords.push(sliceOfCoords);
    }

    return eligibleCoords;
  }

  private computeLatitudinalShiftByDistance(dist: number): number {
    return dist / 69.172;
  }

  private computeLongitudinalShiftAtLatitudeByDistance(lat: number, dist: number): number {
    let longRate = Math.cos(-1 * lat) * 69.172;
    return dist / longRate;
  }

  private printDebuggingMarkers(eligibleCoords: any[]) {
    for (let slice of eligibleCoords) {
      for (let point of slice) {
        let lat = point.lat;
        let lng = point.lng;

        var marker = new google.maps.Marker({
          position: { lat, lng },
          map: this.map
        });
      }
    }
  }

  private getIsochrones(origin: any, coords: any[]) {
    const promisedDistances = coords.map((points, index) => this.getDistance(origin, points, index));
    // Promise.all turns an array of promises into a promise
    // that resolves to an array.
    return Promise.all(promisedDistances);
  }

  private getDistance(origin: any, points: any[], index: number) {
    const service = new google.maps.DistanceMatrixService();

    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: points,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL
        }, (response, status) => {

          if (status === google.maps.DistanceMatrixStatus.OK) {
            resolve({ resp: response, i: index });
          } else {
            reject(new Error('Not OK'));
          }
        }
      );
    });
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
