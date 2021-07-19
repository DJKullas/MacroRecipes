import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from "@angular/router";
import { SearchService } from '../search.service';
declare var require: any
const fracty = require('fracty');

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  recipeId: string;

  recipe: any;
  instructions: any;

  constructor(private readonly route: ActivatedRoute, private readonly searchService: SearchService,
              public auth: AngularFireAuth) { }

  getRecipe(recipeId: string) {
    this.searchService.getRecipe(recipeId).subscribe((data: string ) => {
      var response = data;
     
      this.recipe = JSON.parse(JSON.stringify(response));
      console.log(this.recipe)
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

  convertToFraction(decimal: number): number {
    var result = fracty(decimal);
    console.log("i got after fracty");
    return result;
  }

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get("recipeId");
    this.getRecipe(this.recipeId);
    //this.getRecipeInstructions(this.recipeId);
  }

}
