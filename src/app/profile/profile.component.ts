import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public auth: AngularFireAuth, private readonly afs: AngularFirestore, private readonly searchService: SearchService,
              private router: Router) { }

  savedRecipes: any[];
  savedRecipeIds: string[] = [];
  userId: string;

  populateSavedRecipeIds(): void {
    this.savedRecipes = null;
    this.savedRecipeIds = [];

    this.auth.user.subscribe(res => {

      if (res == null || res == undefined) {
        this.router.navigate(['/login']);
      }

      this.userId = res.uid;
      var doc = this.afs.doc(`user/${this.userId}`);
      var savedRecipeCollection = doc.collection('savedRecipes');
      savedRecipeCollection.valueChanges().subscribe(res => {
        this.savedRecipeIds = [];
        this.addIdsToList(res);
      })
    }, err => {
      this.router.navigate['/login'];
    });
  }

  deleteRecipe(recipeId: string): void {
    this.auth.user.subscribe(res => {
      this.userId = res.uid;

      this.afs.doc(`user/${this.userId}/savedRecipes/${recipeId}`).delete().then(res => {
        console.log(this.savedRecipes);
      });
    });
  }

  addIdsToList(res: any) {
    res.forEach(recipe => {
      this.savedRecipeIds.push(recipe.recipeId); 
    });

    if (this.savedRecipeIds.length > 0) {
      this.getRecipes();
    } else {
      this.savedRecipes = [];
    }
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
    this.searchService.getSavedRecipes(this.savedRecipeIds.toString()).subscribe((data: string ) => {
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
