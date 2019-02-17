import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators'
import { LocationData } from "../geocode-service/LocationData";

@Injectable()
export class IsochroneService {

  public generateIsochrone(origin: LocationData, maxTimeInMins: number): Observable<any> {
    let eligibleCoords = this.computeEligibleCoords(origin, maxTimeInMins);
    return from(this.getIsochrones(origin, eligibleCoords)).pipe(map(x => this.parseDistances(x, origin, maxTimeInMins, eligibleCoords)));
  }

  private parseDistances(result: any[], origin: LocationData, maxTimeInMins: number, eligibleCoords: any[]): any[] {
    let validCoords = [];

    for (let i = 0; i < result.length; i++) {
      let maxI = 0;
      let maxJ = 0;

      for (let j = 0; j < result[i]["resp"].rows[0].elements.length; j++) {
        if (result[i]["resp"].rows[0].elements[j].status === 'OK') {

          var travelTime = result[i]["resp"].rows[0].elements[j].duration.value / 60;

          if (travelTime <= (maxTimeInMins * 1.05)) {
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
    return outCoords;
  }

  private computeEligibleCoords(origin: LocationData, maxTimeInMinutes: number): any[] {
      let speed = (60 / 60);
      let maxDistance = maxTimeInMinutes * speed;

      let eligibleCoords = [];
      let distanceInterval = maxDistance / 12;

      let maxNumberOfSlices = 8;
      let sliceInterval = 360 / maxNumberOfSlices;
      for(let slice = 0; slice< 360; slice += sliceInterval) {
        let sliceOfCoords = [];

        for (let distance = distanceInterval; distance <= maxDistance; distance += distanceInterval) {
          let latDist = distance * Math.cos(slice * Math.PI / 180);
          let longDist = distance * Math.sin(slice * Math.PI / 180);

          let lat = origin.getLat() + this.computeLatitudinalShiftByDistance(latDist);
          let lng = origin.getLng() + this.computeLongitudinalShiftAtLatitudeByDistance(origin.getLat(), longDist);


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

  /*
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
  }*/
}
