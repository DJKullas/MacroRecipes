import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from "@angular/router";
import { SearchService } from '../search.service';
import { faHeart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

declare var require: any
const fracty = require('fracty');

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  recipeId: string;
  userId: string;
  recipe: any;
  instructions: any;
  faHeart = faHeart;
  faChevronLeft = faChevronLeft;
  nutritionWidgetHtml: string;

  constructor(private readonly route: ActivatedRoute, private readonly searchService: SearchService,
              public auth: AngularFireAuth, private readonly afs: AngularFirestore) {
                
               }

  saveRecipe(): void {

    this.auth.user.subscribe(res => {
      this.userId = res.uid;
      this.afs.collection(`user/${this.userId}/savedRecipes`).add({'recipeId': this.recipeId});
      var doc = this.afs.doc(`user/${this.userId}`);
      var savedRecipes = doc.collection('savedRecipes');
      var test = savedRecipes.valueChanges().subscribe(res => {
        res.forEach(x => {
          console.log(x.recipeId);
        })
      })
      console.log("Saved Recipes: " + savedRecipes[0]);
      console.log("test: " + test);
    });

  }

  getRecipe(recipeId: string) {
    this.searchService.getRecipe(recipeId).subscribe((data: string ) => {
      var response = data;
     
      this.recipe = JSON.parse(JSON.stringify(response));
      console.log(this.recipe);
      this.getRecipeNutritionWidget();
      },
    error => {
      console.log("DEF");

    });
  }

  getRecipeInstructions(recipeId: string) {
    console.log("in")
    this.searchService.getRecipeInstructions(recipeId).subscribe((data: string ) => {
      console.log("above")
      var response = data;
    
      console.log("abc453")
      this.instructions = JSON.parse(JSON.stringify(response))[0];

      console.log(this.instructions);
      },
    error => {
      console.log("DEF");

    });
  }

  getRecipeNutritionWidget(): void {

    this.searchService.getRecipeNutritionWidget(this.recipeId).subscribe((data: string ) => {
      var response = data;
    
      this.nutritionWidgetHtml = JSON.parse(JSON.stringify(response));

      console.log(this.nutritionWidgetHtml);
      },
    error => {
      console.log("DEF");

    });



    
  }

  convertToFraction(decimal: number): number {
    var result = fracty(decimal);
    return result;
  }

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get("recipeId");
    this.getRecipe(this.recipeId);
    
    //this.getRecipeInstructions(this.recipeId);
  }

}
