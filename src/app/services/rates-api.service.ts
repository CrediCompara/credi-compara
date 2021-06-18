import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Rates } from '../models/rates';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RatesApiService {

  // Rate Endpoint
  basePath="http://localhost:3000/api/rates";
  httpOptions={ headers: new HttpHeaders({'Content-Type': 'application/json'})}

  constructor(private http: HttpClient) {  }

  // API Error Handling
  handleError(error: HttpErrorResponse): Observable<never>{
    if(error.error instanceof ErrorEvent){
      console.log("An error occurred: ", error.error.message);
    }else {
      console.log("Backend returned code ${error.status}, body was: ${error.error}");
    }
    return throwError("Something happend with request, please try again later.")
  }

  // GET rate
  getRateByValueAndFeeValue(): Observable<Rates[]>{
    return this.http.get<Rates[]>(this.basePath)
      .pipe(retry(2), catchError(this.handleError));
  }
}
