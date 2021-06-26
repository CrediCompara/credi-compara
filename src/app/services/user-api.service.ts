import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {MortgageCredit} from '../models/mortgage-credit';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  basePath="http://localhost:8080/api"
  httpOptions={ headers: new HttpHeaders({'Content-Type': 'application/json'}) }

  constructor(private http: HttpClient) { }


  // API Error Handling
  handleError(error: HttpErrorResponse): Observable<never>{
    if(error.error instanceof ErrorEvent){
      console.log("An error occurred: ", error.error.message);
    }else {
      console.log("Backend returned code ${error.status}, body was: ${error.error}");
    }
    return throwError('Something happened with request, please try again later.')
  }

  // Register User
  registerUser(item: any): Observable<User>{
    return this.http.post<User>(`${this.basePath}/auth/sign-up`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Get MortgageCredits saved by User Id
  getMortgageCreditsByUserId(id: number): Observable<MortgageCredit[]>{
    return this.http.get<MortgageCredit[]>(`${this.basePath}/users/${id}/mortgages`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Save MortgageCredit by User Id
  saveMortgageCreditByUserId(item: any, id: number, id_bank: number): Observable<MortgageCredit>{
    return this.http.post<MortgageCredit>(`${this.basePath}/mortgages/users/${id}/banks/${id_bank}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Delete MortgageCredit by Id
  deleteMortgageCreditByUserId(id: number): Observable<any>{
    return this.http.delete<any>(`${this.basePath}/mortgages/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }
}
