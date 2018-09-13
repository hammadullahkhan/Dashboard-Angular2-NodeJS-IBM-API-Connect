import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { IGroups } from './interfaces/IGroups';
import { Configuration } from './app.constants';

@Injectable()
export class GroupService {

    private actionUrl: string;
    private headers: Headers;

    private groupName = new Subject<IGroups>();    
    public seletedGroup$ = this.groupName.asObservable();
    
    constructor(private _http: Http) {

        this.actionUrl = Configuration.baseUrls.server +
            Configuration.baseUrls.apiUrl +
            'Groups/';

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public publishData(item: IGroups) {
        //console.log('publishing data: ', item );
        this.groupName.next(item);
    }

    public GetAll = (): Observable<IGroups[]> => {
        return this._http.get(this.actionUrl)
            .map((response: Response) => <IGroups[]>response.json())
            .catch(this.handleError);
    }

    public GetSingle = (id: number): Observable<IGroups> => {
        return this._http.get(this.actionUrl + id)
            .map((response: Response) => <IGroups>response.json())
            .catch(this.handleError);
    }

    public Add = (itemName: string): Observable<IGroups> => {
        let toAdd = JSON.stringify({ ItemName: itemName });

        return this._http.post(this.actionUrl, toAdd, { headers: this.headers })
            .map((response: Response) => <IGroups>response.json())
            .catch(this.handleError);
    }

    public Update = (id: number, itemToUpdate: IGroups): Observable<IGroups> => {
        return this._http.put(this.actionUrl + id, JSON.stringify(itemToUpdate), { headers: this.headers })
            .map((response: Response) => <IGroups>response.json())
            .catch(this.handleError);
    }

    public Delete = (id: number): Observable<Response> => {
        return this._http.delete(this.actionUrl + id)
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}