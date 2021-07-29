import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public auth: AngularFireAuth, private readonly afs: AngularFirestore, private readonly searchService: SearchService) { }

  savedRecipes: any[];
  savedRecipeIds: string[] = [];
  userId: string;

  populateSavedRecipeIds(): void {
    this.auth.user.subscribe(res => {
      this.userId = res.uid;
      var doc = this.afs.doc(`user/${this.userId}`);
      var savedRecipeCollection = doc.collection('savedRecipes');
      savedRecipeCollection.valueChanges().subscribe(res => {
        this.addIdsToList(res);
      })
    });
  }

  addIdsToList(res: any) {
    res.forEach(recipe => {
      this.savedRecipeIds.push(recipe.recipeId); 
    });

    this.getRecipes();
  }

  recipeIdsSetToString(): string {

    var uniqueIds = [...new Set(this.savedRecipeIds)];

    console.log("idsarray: " + uniqueIds.toString())

    return uniqueIds.toString();

    // var recipeIdsString: string = "";

    // this.savedRecipeIds.forEach(id => {
    //   console.log("In foreach: " + id)
    //   recipeIdsString.concat(id + ",");
    // });

    // console.log("before substr" + recipeIdsString);
    // var test = recipeIdsString.substring(0, recipeIdsString.length - 1);
    // console.log("Ids list: " + test);
    // return test;
  }

  getNutrientFromRecipe(nutrient: string, recipe: any): string {
    var nutrientResult;
    var resultString: string;

    nutrientResult = recipe.nutrition.nutrients.filter(n => { return n.name ===  nutrient });
    resultString = nutrientResult[0].amount.toString().concat(nutrientResult[0].unit.toString());

    return resultString;
  }

  addNutrientsToRecipe(): void {
    this.savedRecipes.forEach(recipe => {
      recipe.calories = this.getNutrientFromRecipe("Calories", recipe);
      recipe.carbs = this.getNutrientFromRecipe("Carbohydrates", recipe);
      recipe.protein = this.getNutrientFromRecipe("Protein", recipe);
      recipe.fat = this.getNutrientFromRecipe("Fat", recipe);
    });
    console.log(this.savedRecipes);
  }

  getRecipes(): void {
    this.searchService.getSavedRecipes(this.recipeIdsSetToString()).subscribe((data: string ) => {
      var response = data;
     
      this.savedRecipes = JSON.parse(JSON.stringify(response));
      console.log(this.savedRecipes);
      this.addNutrientsToRecipe();
      },
    error => {
      console.log("DEF");

    });
  }

  ngOnInit(): void {
  this.populateSavedRecipeIds(); 

  }

}
