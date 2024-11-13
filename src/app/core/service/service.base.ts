import { Observable, ObservableInput } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { RequestOptions, Headers, URLSearchParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { from as observableFrom } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';




import { CustomErrorHandler } from './CustomErrorHandler';
export abstract class ServiceBase {

  mock: any;
  protected log: LogService;

  useMock = environment.useMock;

  constructor(
    protected http: HttpClient,
    private auth: AuthService,
    log: LogService,
    private errorHandler: CustomErrorHandler
  ) {
    this.log = log;
  }

  private handleError(err, caught) {
    return this.errorHandler.handleServerError(err, caught);
  }

  private setMock(data) {
    this.mock = data;
    this.mock['v1.0/forms?type=3'] = this.mock['v1.0/forms/08c8cbd0-9d7c-46f4-8d17-6a044986c75a'];
    this.mock['v1.0/forms?type=4'] = this.mock['v1.0/forms/3e3066b3-ca8a-4d61-8685-4c95b4e47e93'];
    this.mock['v1.0/forms?type=5'] = this.mock['v1.0/forms/991af3c1-dbcf-466a-86f1-12290163de32'];
    this.mock['v1.0/forms?type=6'] = this.mock['v1.0/forms/4360e21b-04ff-462d-906a-a1bc3ae42c78'];
  }

  private mockGet(url: string, params?: Object): Observable<any> {
    if (params) {
      const search = new URLSearchParams();
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          search.set(key, params[key]);
        }
      }
      url += search.toString();
    }

    if (this.mock) {
      return observableOf(this.mock[url].data);
    } else {
      return this.http.get('/assets/mock.json')
        .pipe(map((response: any) => {
          this.setMock(response.json());
          return this.mock[url].data;
        }))
        .catch(this.handleError.bind(this));
    }
  }

  protected get(url: string, params?: Object, props?: Object): Observable<any> {
    if (this.useMock) {
      return this.mockGet(url, params);
    }
    return observableFrom(this.auth.getToken())
      .catch(this.handleError.bind(this))
      .pipe(mergeMap(token => {
        const endpoint = `${environment.api.root}/${url}`;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        let httpPaarams: HttpParams = new HttpParams();
        if (params) {
          Object.keys(params).forEach((key: string) => {
            const value: string | number | boolean | Date = params[key];
            if ((typeof value !== 'undefined') && (value !== null)) {
              httpPaarams = httpPaarams.append(key, value.toString());
            }
        });
        }

        return this.http.request('GET', endpoint, 
          {
            headers:{'Authorization': `Bearer ${token}`},
            params: httpPaarams
          })
        .pipe(
          map(response => {
            if ((<any>response)._body === '') {
              return null;
            } else {
              if (response) {
                return response['data'];
              } else {
                return null;
              }
            }
          }),
          tap(data => {
            this.log.isOffline = false;
          }))
          .catch(this.handleError.bind(this));
      }))
      .catch(this.handleError.bind(this));
  }

  protected put(url, payload): Observable<any> {
    return observableFrom(this.auth.getToken())
      .catch(this.handleError.bind(this))
      .pipe(mergeMap(token => {
        const endpoint = `${environment.api.root}/${url}`;
        return this.http.put(endpoint, payload,{ headers:{'Authorization': `Bearer ${token}`}}).catch(this.handleError.bind(this));
      }))
      .catch(this.handleError.bind(this));
  }
  protected post(url, payload, headers: Headers = new Headers()): Observable<any> {
    return observableFrom(this.auth.getToken())
      .catch(this.handleError.bind(this))
      .pipe(mergeMap(token => {
        const endpoint = `${environment.api.root}/${url}`;
        const headers = {'Authorization': `Bearer ${token}`};
        return this.http
          .post(endpoint, payload, {headers})
          .pipe(map(response => {
              if (response) {
                if (response && response['data']) {
                  return response['data'];
                } else {
                  return response;
                }
              } else {
                return null;
              }
            }))
          .catch(this.handleError.bind(this));
      }))
      .catch(this.handleError.bind(this));
  }

  protected patch(url, payload): Observable<any> {
    return observableFrom(this.auth.getToken())
      .catch(this.handleError.bind(this))
      .pipe(mergeMap(token => {
        const endpoint = `${environment.api.root}/${url}`;
        const headers = {'Authorization': `Bearer ${token}`};
        return this.http
          .patch(endpoint, payload, {headers})
          .catch(this.handleError.bind(this));
      }))
      .catch(this.handleError.bind(this));
  }

  protected delete(url): Observable<any> {
    return observableFrom(this.auth.getToken())
      .catch(this.handleError.bind(this))
      .pipe(mergeMap(token => {
        const endpoint = `${environment.api.root}/${url}`;
        const headers = {'Authorization': `Bearer ${token}`};
        return this.http
          .delete(endpoint, {headers})
          .catch(this.handleError.bind(this));
      }))
      .catch(this.handleError.bind(this));
  }


  protected getFile(url): Observable<any> {
    return this.http.get(url)
      .pipe(map((response: any) => {
          return response;
      }))
      .catch(this.handleError.bind(this));
  }

  protected getFileWithToken(url): Observable<any> {
    return observableFrom(this.auth.getToken())
      .catch(this.handleError.bind(this))
      .pipe(mergeMap(token => {
        const endpoint = `${environment.api.root}/${url}`;
        const headers = {'Authorization': `Bearer ${token}`};
        return this.http
          .get(endpoint, {headers: headers , observe: 'response', responseType: 'blob'})
          .pipe(map(response => {
            return (<any>response).body;
          }));
        }))
        .catch(this.handleError.bind(this));

  }

  protected getHtml(url): Observable<any> {
    return this.http.get(url)
      .pipe(map(response => (<any>response)._body))
      .catch(this.handleError.bind(this));
  }

}
