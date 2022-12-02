import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  token: any;
  constructor(private http: HttpClient) {
    this.getToken();

  }
  async getToken() {
    let token_id = await Storage.get({ key: 'my-token' });
    this.token = token_id.value;
  }

  getPagesData(page_id): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.get(environment.wordpress.api_url + "wp-json/wp/v2/pages/" + page_id).pipe(
      tap(post => console.log('All Post fetched!'))
    );
  }
}
