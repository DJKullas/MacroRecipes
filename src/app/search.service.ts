import { Injectable } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'
import {HttpClient} from '@angular/common/http';
import { map} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  search(query: string) {
    return this.http.get('/api/search', {params: {query: query}});
  }

  searchByMacros(minCarbs: string, minFat: string, minProtein: string, maxCarbs: string, maxFat: string, maxProtein: string, minCalories: string, maxCalories: string) {
    return this.http.get('/api/searchByMacros', {params: {minCarbs: minCarbs,maxCarbs: maxCarbs, 
                                                          minFat: minFat, maxFat: maxFat,
                                                          minProtein: minProtein, maxProtein: maxProtein,
                                                          minCalories: minCalories, maxCalories: maxCalories}});
  }

}