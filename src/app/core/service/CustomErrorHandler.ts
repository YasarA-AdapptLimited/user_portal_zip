
import {throwError as observableThrowError} from 'rxjs';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { LogService } from './log.service';
import * as StackTrace from 'stacktrace-js';
import { Observable } from 'rxjs/internal/Observable';

import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError} from '../model/ValidationError';
import { HandledError } from '../model/HandledError';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor(private log: LogService, private locationStrategy: LocationStrategy) { }

  handleServerError(errorResponse: HttpErrorResponse, caught: Observable<any>): Observable<any> {
    if ((<any>errorResponse).serverError) { return observableThrowError(errorResponse); } // already handled
    let log;
    let flag = true;
    let validationErrors: Array<ValidationError> = [];
    const message = errorResponse.message ? errorResponse.message : errorResponse.toString();
    const output: HandledError = { status: errorResponse.status };
    if (errorResponse.status === 0 || message.indexOf('Uncaught (in promise): 0') > -1) {
      this.log.isOffline = true;
    } else if (errorResponse.status === 500) {
      if (errorResponse.error) {
        const error = errorResponse.error;
        log = this.log.error(error, errorResponse);
      } else {
        if ((<any>errorResponse)._body) {
          try {
            const body = JSON.parse((<any>errorResponse)._body);
            log = this.log.error('Internal server error', body);
          } catch (e) {
            log = this.log.error(`Server responded with 'Internal server error' but no excpetion message was found`, errorResponse);
          }
        }
      }
    } else if (errorResponse.status === 404) {
      flag = false;
    } else if (errorResponse.status === 400) {  // Bad request = handle validation error
      let modelState;
      if (errorResponse.error) {
        modelState = errorResponse.error.modelState;
      } else if ((<any>errorResponse)._body) {
        try {
          modelState = JSON.parse((<any>errorResponse)._body).modelState;
        } catch (e) {
          modelState = undefined;
        }
      }
      if (!modelState) {
        if (errorResponse.error && errorResponse.error.message) {
          log = this.log.error(errorResponse.error.message, errorResponse);
        } else {
          try {
            const body = JSON.parse((<any>errorResponse)._body);
            log = this.log.error(body.message, errorResponse);
            output.message = body.message;
            flag = false;
          } catch (e) {
            log = this.log.error('Server responded with \'Bad request\' but no error messages were returned', errorResponse);
          }
        }
      } else {
        for (const fieldName in modelState) {
          if (modelState.hasOwnProperty(fieldName)) {
            validationErrors = validationErrors.concat({ property: fieldName.replace('request.', ''), errors: modelState[fieldName]});
          }
        }
        validationErrors = validationErrors.filter(e => e.errors !== null &&
          e.errors !== undefined && e.errors.length && e.errors.length > 0);
        output.validationErrors = validationErrors;
        output.status = 400;
        log = this.log.error('Server validation error', validationErrors);
        if(modelState.request && modelState["request"] !== null && modelState["request"].length > 0) {
          if(validationErrors && validationErrors.length > 0)
          {
            if(validationErrors.filter((item) => item.property && item.property === 'request').length > 0)
            {
              let item = validationErrors.filter((item) => item.property && item.property === 'request')[0];
              if(item.errors && item.errors.length > 0){
                log = this.log.error(`Server validation error - ${item.errors[0]}`, validationErrors);
              }
            }
          }
          flag = true;
        } else {
          flag = false;
        }
      }
    } else {
      output.status = errorResponse.status;
      output.statusText = errorResponse.statusText;
      output.message = errorResponse.message;
      log = this.log.error(errorResponse.message ||
        errorResponse.statusText || errorResponse.error || errorResponse.statusText, errorResponse);
    }

    if (flag && log) {
      this.log.flag(log);
    }

    output.serverError = true;
    return observableThrowError(output);
  }

  handleError(error) {
    if (error.serverError) { return; }
    let log;
    const message = error.message ? error.message : error.toString();
    const chunkLoadFailMessage = /Loading chunk [\d]+ failed/;

    if (message.indexOf('SyntaxError: Unexpected token < in JSON at position 0') > -1) {
      log = this.log.error(`Unable parse response as JSON (maybe the api url is wrong?)`, error);
      this.log.flag(log);
      return;
    }
    if (message.indexOf('Uncaught (in promise): 0') > -1) {
      this.log.offline(true);
      return;
    }
    if(chunkLoadFailMessage.test(message)) {
      window.location.reload();
    }


    if (error.stack) {
      log = this.log.error(error.message);
      this.log.flag(log);
      throw(error);
    }
    const page = this.locationStrategy instanceof PathLocationStrategy
      ? this.locationStrategy.path() : 'unknown url';

    try {
      StackTrace.fromError(error).then(stackframes => {
        const stacktrace = {
          page,
          trace: stackframes.filter(sf => sf.fileName.indexOf('src/app') > -1)
        };
        log = this.log.error(message, stacktrace);
      });
    } catch (e) {
      log = this.log.error('Error getting stack trace', e, message);
    }

    this.log.flag(log);
  }


  flag(log, message) {
    const noflag = ['user_cancelled', 'interaction_required'];
    let flag = true;
    noflag.forEach(item => {
      if (message.indexOf(item) > -1) {
        flag = false;
      }
    });
    if (flag) {
      this.log.flag(log);
    }
  }
}
