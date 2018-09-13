/**
 * Service base on which all other services are based.
 * Handles the boiler plate code for communicating with the server
 */
import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, Request } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BaseService {
    location: Location;
    constructor(private http: Http) { }

    apiCall(url: string, verb: string, payload?: any, contentType?: string): Observable<Response> {
        // defining headers for the request
        let headers = new Headers();
        headers.append('Content-Type', (contentType || 'application/json'));

        // defining options for the request
        let requestOptions = new RequestOptions({
            method: verb,
            url:  location.origin + url,
            headers: headers
        });

        if (payload) {
            requestOptions.body = payload;
        }

        // passing request to the server and returing promise to be used further
        return this.http.request(new Request(requestOptions))
            .catch(this.handleError);
    }

    // error handling
    private handleError(error, source): Observable<Response> {
        return Observable.throw(error);
    }
}
