import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SearchService } from '../search.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  recipeId: string;
  response: string;

  recipe: any;

  constructor(private readonly route: ActivatedRoute, private readonly searchService: SearchService) { }

  getRecipe(recipeId: string) {
    this.searchService.getRecipe(recipeId).subscribe((data: string ) => {
      this.response = data;
      console.log("response Macros")
      console.log(this.response);

      this.recipe = JSON.parse(JSON.stringify(this.response));
      },
    error => {
      console.log("DEF");

    });
  }

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get("recipeId");
    this.getRecipe(this.recipeId);
  }

}
