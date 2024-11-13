
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { of as observableOf, from as observableFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { FaqCategory } from '../model/Faq';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PublicService {

  faq: FaqCategory[];

  constructor(private http: HttpClient) { }

  getFaq(): Observable<Array<FaqCategory>> {
    if (this.faq) {
      return observableOf(this.faq);
    }

    const endpoint = `${environment.api.root}/v1.0/contents/faq`;
    return this.http.get(endpoint)
      .pipe(map(response => {
        const data = response['data'];
        data.categories.forEach(c => {
          c.openState = 'closed';
          c.questions.forEach(q => {
            q.openState = 'closed';
          });
        });
        this.faq = <Array<FaqCategory>>data.categories;
        return this.faq;
      }))
      .catch(response => observableThrowError(response.json().data));
  }
}
