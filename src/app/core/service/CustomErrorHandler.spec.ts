import { CustomErrorHandler } from './CustomErrorHandler';
import { LogService } from './log.service';
import { LocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { Http } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
const sinon = require('sinon');

describe('CustomErrorHandler', () => {

  let handler, logService, logErrorSpy, logFlagStub, logOfflineStub;
  const init = () => {
    logService = new LogService();
    logErrorSpy = sinon.stub(logService, 'error').callsFake((error) => error);
    handler = new CustomErrorHandler(logService, null);
    logFlagStub = sinon.stub(logService, 'flag');
    logOfflineStub = sinon.stub(logService, 'offline');
  };

  describe('when internal server error (500)', () => {

    const default500 = new HttpErrorResponse({ status: 500, error: 'Internal server error' });
    beforeEach(init);

    const checkCommonFunctionality = output => {
      expect(output.serverError).toEqual(true);
      expect(logErrorSpy.called).toBeTruthy();
    };

    it('should set serverError flag', () => {
      handler.handleServerError(default500, null).subscribe(result => { }, (output: any) => {
        expect(output.serverError).toEqual(true);
      });
    });


    it('should flag 500 server error to log service', () => {
      const error = 'MariusCaesar';
      const html500 = new HttpErrorResponse({ status: 500, error });
      handler.handleServerError(html500, null).subscribe(result => { }, (output: any) => {
        checkCommonFunctionality(output);
        expect(logFlagStub.called).toBeTruthy();
        sinon.assert.calledWith(logFlagStub, error);
      });
    });

  });

  describe('When internal server error 404', () => {
    const default404 = new HttpErrorResponse({ status: 404, error: 'Not found' });

    beforeEach(init);

    it('Should not call logservice to flag the error', () => {
      handler
        .handleServerError(default404, null)
        .subscribe(
          next => { },
          (err: any) => {
            expect(logFlagStub.called).toBeFalsy();
          }
        );
    });
  });

  describe('When internal server error 400', () => {
    const default400 = new HttpErrorResponse({ status: 400, error: 'Bad Request' });

    beforeEach(init);

    it('Should log the error', () => {
      handler
        .handleServerError(default400, null)
        .subscribe(
          next => { },
          (error: any) => {
            expect(logErrorSpy.called).toBeTruthy();
          }
        );
    });

    it('should flag the error if the server does not return parsedable json in the response _body', () => {
      handler
        .handleServerError(default400, null)
        .subscribe(
          next => { },
          (output: any) => {
            expect(logFlagStub.called).toBeTruthy();
          }
        );
    });

    const withJson400 = new HttpErrorResponse({ status: 400, error: 'Bad Request',  });
    (<any>withJson400)._body = `{ "message": "field incorrect" } `;

    it('should not flag the error to the user if json returned and error exists', () => {
      handler
        .handleServerError(withJson400, null)
        .subscribe(
          next => { },
          (output: any) => {
            expect(logFlagStub.called).toBeFalsy();
            expect(output.message).toEqual('field incorrect');
          }
        );
    });

    it('should update validation array', () => {
      handler
        .handleServerError(default400, null)
        .subscribe(
          next => { },
          output => {
            // expect(logFlagStub.called).toBeFalsy();
            // console.log(output);
          }
        );
    });

  });

  describe('When Handling errors (.handleError)', () => {

    const customError1 = {
      serverError: true,
      message: 'SyntaxError: Unexpected token < in JSON at position 0'
    };
    const customError2 = {
      serverError: false,
      message: 'SyntaxError: Unexpected token < in JSON at position 0'
    };
    const customError3 = {
      serverError: false,
      message: 'Uncaught (in promise): 0'
    };

    beforeEach(init);

    it('If this is a server error, return undefined, do not flag or log anything', () => {
      handler
        .handleError(customError1);
      expect(logErrorSpy.called).toBeFalsy();
      expect(logFlagStub.called).toBeFalsy();
    });
    it('If there is an error message, flag the error to the user and log to the console', () => {
      handler
        .handleError(customError2);
      expect(logErrorSpy.called).toBeTruthy();
      expect(logFlagStub.called).toBeTruthy();
    });
    it('If the error message is a from a failed promise, set logService offline to true, inform the user', () => {
      handler
        .handleError(customError3);
      // console.log(logOfflineStub)
      expect(logOfflineStub.alwaysCalledWith(true)).toBeTruthy();
    });


  });

  describe('When flagging errors (.flag)', () => {
    const default400 = new HttpErrorResponse({ status: 400, error: 'Bad Request' });

    beforeEach(init);

    const customFlagError1 = {
      serverError: true,
      message: 'user_cancelled'
    };

    const customFlagError2 = {
      serverError: true,
      message: 'Mr Ghengis Khan reporting for dinner!'
    };

    it('Should not flag the user if there is noflag message', () => {
      handler
        .flag(default400, customFlagError1.message);
      expect(logFlagStub.called).toBeFalsy();
    });

    it('Should flag the user if there is no noflag message', () => {
      handler
        .flag(default400, customFlagError2.message);
      expect(logFlagStub.called).toBeTruthy();
    });

  });



});

