import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AskmebuddyService {

  constructor(private http: HttpClient) {

  }

  askQuestion(data, token): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    return this.http.post(environment.wordpress.api_url + "wp-json/wp/v2/askmebuddy/form", JSON.stringify(data), httpOptions).pipe(
      tap(post => console.log('All Post fetched!'))
    );
  }

  askQuestionAnswer(email): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.get(environment.wordpress.api_url + "wp-json/wp/v2/askmebuddy/email?email=" + email, httpOptions).pipe(
      tap(data => console.log("get dataanswer"))
    );
  }

}
