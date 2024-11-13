import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BroadcastService, MsalInterceptor, MsalService } from "@azure/msal-angular";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class MSALInterceptorExtended extends MsalInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, msalService: MsalService,broadcastService: BroadcastService){
        super(msalService, broadcastService)
    }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(!this.authService.getUserId() && request.url.indexOf('maintenance-message')) {
        return next.handle(request);
    }else {
        return super.intercept(request, next);
    }
  }
}