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

  searchByMacros(minCarbs: string, maxCarbs: string, minFat: string, maxFat: string, minProtein: string, maxProtein: string, minCalories: string, maxCalories: string) {
    return this.http.get('/api/searchByMacros', {params: {minCarbs: minCarbs,maxCarbs: maxCarbs, 
                                                          minFat: minFat, maxFat: maxFat,
                                                          minProtein: minProtein, maxProtein: maxProtein,
                                                          minCalories: minCalories, maxCalories: maxCalories}});
  }

  getRecipe(recipeId: string) {
    return this.http.get('/api/recipe', {params: {recipeId: recipeId}});
  }

  getRecipeNutritionWidget(recipeId: string) {
    return this.http.get('/api/nutritionWidget', {params: {recipeId: recipeId}});
  }

  getSavedRecipes(recipeIds: string) {
    return this.http.get('/api/savedRecipes', {params: {recipeIds: recipeIds}});
  }

  getRecipeInstructions(recipeId: string) {
    return this.http.get('/api/recipeInstructions', {params: {recipeId: recipeId}});
  }

}