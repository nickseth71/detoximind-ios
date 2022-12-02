import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Storage } from '@capacitor/storage';


const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  userData: any;
  constructor(
    private http: HttpClient
  ) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { username, password }): Observable<any> {
    // https://detoximinddev.wpengine.com/
    return this.http.post(`${environment.wordpress.api_url}wp-json/jwt-auth/v1/token`, credentials).pipe(
      map((data: any) => {
        console.log("get data------->", data);
        this.userData = data.data;
        Storage.set({ key: "user_data", value: JSON.stringify(this.userData) })
        return data.data.token
      }),
      switchMap(token => {
        return from(Storage.set({ key: TOKEN_KEY, value: token }));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    this.remove_journalAuth();
    Storage.remove({key:"user_data"});
    return Storage.remove({ key: TOKEN_KEY });
  }

  getUserData() {
    return Storage.get({ key: "user_data" });
  }

  updateUserData(updatedUserData) {
    return Storage.set({ key: "user_data", value: JSON.stringify(updatedUserData) });
  }


  getAdminToken() {
    let data = {
      "username": "detoximinddev",
      "password": "Det0x!m1nD792"
    }
    return this.http.post(`${environment.wordpress.api_url}wp-json/jwt-auth/v1/token`, data);
  }




  jounalLogin(credentials: { username, password }): Observable<any> {
    // https://detoximinddev.wpengine.com/
    return this.http.post(`${environment.wordpress.api_url}wp-json/jwt-auth/v1/token`, credentials).pipe(
      map((data: any) => {
        this.userData = data.data;
        Storage.set({ key: "user_data", value: JSON.stringify(this.userData) })
        Storage.set({ key: "journal_login", value: JSON.stringify({ journal_token: true }) })
        from(Storage.set({ key: TOKEN_KEY, value: data.data.token }));
        return this.userData;
      })
    )
  }

  getJournalPassword() {
    return Storage.get({ key: "journal_login" });
  }
  
  remove_journalAuth() {
    Storage.remove({ key: "journal_login" });
    return true;
  }
}