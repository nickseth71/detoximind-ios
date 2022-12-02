import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class UserupdateServiceService {
  httpHeader: any;
  token: any;
  constructor(private http: HttpClient) {
    this.getToken();
  }
  async getToken() {
    let token_id = await Storage.get({ key: 'my-token' });
    this.token = token_id.value;
  }

  getAdminToken() {
    let data = {
      "username": "detoximinddev",
      "password": "Det0x!m1nD792"
    }
    return this.http.post(`${environment.wordpress.api_url}wp-json/jwt-auth/v1/token`, data);
  }

  getUserData(user_id): Observable<any> {
    this.getToken();
    // let header = new HttpHeaders().set(
    //   "Authorization",
    //   'Bearer ' + this.token
    // );
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
    
    return this.http.get(environment.wordpress.api_url + "wp-json/wp/v2/users/" + user_id, httpOptions).pipe(
      tap(User => console.log('User details fetched!', User))
    );
  }
  updateUserProfile(id, data): Observable<any> {
    this.getToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.post(environment.wordpress.api_url + "wp-json/wp/v2/users/" + id, JSON.stringify(data), httpOptions).pipe(
      tap(User => console.log('User details fetched!', User))
    );
  }

  uploadMedia(data, base64, token) {
    this.getToken();

    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Content-Disposition': 'attachment; filename="file.jpg"',
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
      })
    };


    let formData = new FormData();

    // formData.append('file', {
    //   base64: base64,
    //   name: `photo_${data.imageName}.${data.format}`,
    //   type: `image/${data.format}`,
    // });


    // formData.append('file', {
    //   base64,
    //   name: `photo_${data.imageName}.${data.format}`,
    //   type: `image/${data.format}`,
    // });
    return data;
    // return this.http.post(environment.wordpress.api_url + 'wp-json/wp/v2/media', JSON.stringify(formData), httpOptions)
  }

  deleteAccount(data,token_admin:any){
 
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token_admin
        })
      };
      console.log("token===>",httpOptions,token_admin);
      return this.http.post(environment.wordpress.api_url + "wp-json/wp/v2/users/delete",JSON.stringify(data), httpOptions).
      pipe(tap(User => console.log('User delete details!', User)));
     
  }

}
