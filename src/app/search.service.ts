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

  searchByMacros(maxMinutes: string, selectedDiet: string, selectedIntolerance: string, selectedCuisine: string, numResults: string, randomizeResults: string, minCarbs: string, maxCarbs: string, minFat: string, maxFat: string, minProtein: string, maxProtein: string, minCalories: string, maxCalories: string, 
                 excludeIngredients: string, includeIngredients: string, queryString: string, minCholesterol: string, maxCholesterol: string,
                 minSodium: string, maxSodium: string, minSugar: string, maxSugar: string, minFiber: string, maxFiber: string, role?: string) {
    return this.http.get('/api/searchByMacros', {params: {minCarbs: minCarbs,maxCarbs: maxCarbs, 
                                                          minFat: minFat, maxFat: maxFat,
                                                          minProtein: minProtein, maxProtein: maxProtein,
                                                          minCalories: minCalories, maxCalories: maxCalories,
                                                          excludeIngredients: excludeIngredients,
                                                          includeIngredients: includeIngredients,
                                                          queryString: queryString,
                                                          minCholesterol: minCholesterol, maxCholesterol: maxCholesterol,
                                                          minSodium: minSodium, maxSodium: maxSodium,
                                                          minSugar: minSugar, maxSugar: maxSugar,
                                                          minFiber: minFiber, maxFiber: maxFiber, role: role, randomizeResults: randomizeResults,
                                                          numResults: numResults, maxMinutes: maxMinutes, selectedDiet: selectedDiet, selectedIntolerance: selectedIntolerance,
                                                          selectedCuisine: selectedCuisine
                                                        }});
  }

  getRecipe(recipeId: string) {
    return this.http.get('/api/recipe', {params: {recipeId: recipeId}});
  }

  getRecipeNutritionWidget(recipeId: string) {
    return this.http.get('/api/nutritionWidget', {params: {recipeId: recipeId}});
  }

  getRecipePriceWidget(recipeId: string) {
    return this.http.get('/api/priceWidget', {params: {recipeId: recipeId}});
  }

  getSavedRecipes(recipeIds: string) {
    return this.http.get('/api/savedRecipes', {params: {recipeIds: recipeIds}});
  }

  getRecipeInstructions(recipeId: string) {
    return this.http.get('/api/recipeInstructions', {params: {recipeId: recipeId}});
  }

  sendEmail(name: string, email: string, message:string) {
    console.log("SENDING EMAIL")
    return this.http.get('/api/contact', {params: {name: name, email: email, message: message}});
  }

}