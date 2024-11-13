
import {throwError as observableThrowError} from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LogService } from './log.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UpdaterService {


  updateInterval;
  updating = false;
  updateRequired = false;
  version;


  constructor(protected http: HttpClient, private log: LogService, private router: Router, private zone: NgZone) {
    this.version = { current: environment.version };
  }

  check() {
    return this.http
      .get(environment.webRoot + '/assets/version.json?t=' + new Date().getTime())
      .pipe(
        map(response => {
        const config = response;
        this.updateRequired = config['version'] !== environment.version;
        return { current: environment.version, deployed: config['version'] };
      }),
      tap(data => {
        this.log.offline(false);
      })).catch(response => {
        if (response.status === 0 ) {
          this.log.offline(true);
        }
        return observableThrowError(response);
      }
    );
  }

  startChecking() {
     this.updateInterval = setInterval(this.checkForUpdates.bind(this), 60000);
  }

  checkForUpdates() {
    if (this.updateRequired) { return; }
    this.check().subscribe(version => {
      setTimeout(() => {
        this.version = version;
      }, 200);
    });
  }

  update() {
    this.updating = true;
    setTimeout(() => {
      this.router.navigate(['']).then(() => {
        this.zone.runOutsideAngular(() => {
          if(window.location.href.indexOf('#') >= 0) {
            window.location.reload(); 
          } else {
            window.location.href = window.location.href;
          }
        });
      });
    });
  }

  postpone() {
    this.updateRequired = false;
    window.clearInterval(this.updateInterval);
  }
}
