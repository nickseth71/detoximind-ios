import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
// import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  constructor(
    private http: HttpClient
  ) { }

  createNewNotes(data): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post(environment.wordpress.api_url + "wp-json/wp/v2/journal_notes/form", data, httpOptions);
  }

  getTextNotes(email): Observable<any> {
    return this.http.get(environment.wordpress.api_url + "wp-json/wp/v2/journal_notes/email?email=" + email);
  }

  updateNotes(data): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.put(environment.wordpress.api_url + "wp-json/wp/v2/update_journal_notes/email", data, httpOptions);
  }

  deleteNotes(data): Observable<any> {
    return this.http.delete(environment.wordpress.api_url + "wp-json/wp/v2/delete_journal_notes/email?email=" + data.email + "&id=" + data.id);
  }
}
