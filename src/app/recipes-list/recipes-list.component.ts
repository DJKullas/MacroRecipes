import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service'
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeart2 } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {

  query: string = "apple pie";
  response: string;
  minCarbs: number;
  maxCarbs: number;
  minFat: number;
  maxFat: number;
  minProtein: number;
  maxProtein: number;
  minCalories: number;
  maxCalories: number;
  minSodium: number;
  maxSodium: number;
  minSugar: number;
  maxSugar: number;
  minFiber: number;
  maxFiber: number;
  minCholesterol: number;
  maxCholesterol: number;
  numResults: number;
  maxMinutes: number;

  excludeIngredients: string;
  includeIngredients: string;
  queryString: string;

  userId: string;
  faHeart = faHeart;
  faHeart2 = faHeart2;
  savedRecipeIds: string[];

  role: string;
  maxFreeSaves: number = 5;
  allowedToAddMoreRecipes = true;
  randomizeResults: boolean = false;

  includeIngredientsPlaceholder: string;
  excludeIngredientsPlaceholder: string;
  randomCheckboxText: string;
  premiumResultsNumberText: string;
  ultraResultsNumberText: string;
  maxNumResults: number;

  recipes: Object[];
  selectedCuisine: string;
  selectedDiet: string;
  selectedIntolerance: string;

  intoleranceTypes: string[] = [ "Dairy",
    "Egg",
    "Gluten",
    "Grain",
    "Peanut",
    "Seafood",
    "Sesame",
    "Shellfish",
    "Soy",
    "Sulfite",
    "Tree Nut",
    "Wheat" ]

  dietTypes: string[] = [ "Gluten Free",
    "Ketogenic",
    "Vegetarian",
    "Lacto-Vegetarian",
    "Ovo-Vegetarian",
    "Vegan",
    "Pescatarian",
    "Paleo",
    "Primal",
    "Low FODMAP",
    "WHole30" ];

  cuisineTypes: string[] = ["African",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese"];

  constructor(private readonly searchService: SearchService, private readonly sanitizer: DomSanitizer,
              public auth: AngularFireAuth, private readonly afs: AngularFirestore, private router: Router) { }


  getSavedRecipes(): void {
    this.savedRecipeIds = [];

    this.auth.user.subscribe(res => {

      if (res == null || res == undefined) {
        return;
      }

      this.userId = res.uid;
      var doc = this.afs.doc(`user/${this.userId}`);
      var savedRecipeCollection = doc.collection('savedRecipes');
      savedRecipeCollection.valueChanges().subscribe(res => {
        this.savedRecipeIds = [];
        if (!(this.role == 'premium') && res.length >= this.maxFreeSaves) {
          this.allowedToAddMoreRecipes = false;
        } else {
          this.allowedToAddMoreRecipes = true;
        }
        res.forEach(recipe => {
          this.savedRecipeIds.push(recipe.recipeId); 
        });
      })
    }, err => {
      this.router.navigate(['/login']);
    });
  }

  saveRecipe(recipeId: string): void {

    if (!this.allowedToAddMoreRecipes) {
      document.getElementById("showModal").click();
      return;
    }

    if (this.auth.user != null) {
      this.auth.user.subscribe(res => {
        if (res == null || res == undefined) {
          this.router.navigate(['/login']);
          return;
        }
        this.userId = res.uid;
        
        this.afs.collection(`user/${this.userId}/savedRecipes`).doc(recipeId.toString()).set({'recipeId': recipeId});
      });
  
    } else {
      this.router.navigate(['/login']);
    }
  }

  search() {
    this.response = "";
    this.searchService.search(this.query).subscribe((data: string ) => {
      this.response = data;
      console.log("response")
      console.log(this.response);
      },
    error => {
      console.log("DEF");

    });
  }

  getNutrientInfo(nutrient: string, recipe: any) {
    var nutrientObject = recipe.nutrition.nutrients.find(x => x.name == nutrient);
    var result: string;

    if (nutrientObject != null && nutrientObject != undefined) {
      result = nutrientObject?.amount?.toFixed(0).toString().concat(nutrientObject?.unit?.toString());
    } 
    else {
      result = "";
    }


    return result;
  }

  searchByMacros() {
    this.recipes = null;
    let randomizeString: string;

    if (this.numResults > this.maxNumResults) {
      this.numResults = 10;
    }

    if (this.randomizeResults) {
      randomizeString = "sort"
    }

    this.searchService.searchByMacros(this.maxMinutes?.toString(), this.selectedDiet?.toString(), this.selectedIntolerance?.toString(), this.selectedCuisine?.toString(), 
                                      this.numResults?.toString(), randomizeString?.toString(), this.minCarbs?.toString(), this.maxCarbs?.toString(), 
                                      this.minFat?.toString(), this.maxFat?.toString(),
                                      this.minProtein?.toString(), this.maxProtein?.toString(),
                                      this.minCalories?.toString(), this.maxCalories?.toString(),
                                      this.excludeIngredients?.toString(), this.includeIngredients?.toString(),
                                      this.queryString?.toString(),
                                      this.minCholesterol?.toString(), this.maxCholesterol?.toString(),
                                      this.minSodium?.toString(), this.maxSodium?.toString(),
                                      this.minSugar?.toString(), this.maxSugar?.toString(),
                                      this.minFiber?.toString(), this.maxFiber?.toString(), this.role?.toString()).subscribe((data: string ) => {
      this.response = data;
      console.log("response Macros")
      console.log(this.response);

      var results = JSON.parse(JSON.stringify(this.response));
      this.recipes = results.results;
      localStorage.removeItem('recipes');
      localStorage.setItem('recipes', JSON.stringify(this.recipes));
      },
    error => {
      console.log("DEF");

    });
  }

  deleteRecipe(recipeId: string): void {
    this.auth.user.subscribe(res => {
      this.userId = res.uid;

      this.afs.doc(`user/${this.userId}/savedRecipes/${recipeId}`).delete().then(res => {
        
      });
    });
  }

  sanitize(url: string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  loadListIfPresent(): void {
    this.recipes = JSON.parse(localStorage.getItem('recipes'));

    if (this.recipes == null || this.recipes == undefined) {
      this.recipes = [];
    }

  }

  initializePlaceholders() {

    console.log("ROLE: " + this.role)

    this.numResults = 10;
    this.selectedCuisine = "all";
    this.selectedDiet = "all";
    this.selectedIntolerance = "none";

    if (this.role == "ultra") {
      this.ultraResultsNumberText = "# of Results: 100"
      this.premiumResultsNumberText = "# of Results: 50"; 
      this.includeIngredientsPlaceholder = "Include Ingredients (comma separated)";
      this.excludeIngredientsPlaceholder = "Exclude Ingredients (comma separated)";
      this.maxNumResults = 100;
    }
    else if (this.role == "premium") {
      this.includeIngredientsPlaceholder = "Include Ingredients (comma separated)";
      this.excludeIngredientsPlaceholder = "Exclude Ingredients (comma separated)";
      this.premiumResultsNumberText = "# of Results: 50"; 
      this.ultraResultsNumberText = "Upgrade for 100";
      this.randomCheckboxText = "";
      this.maxNumResults = 50;
    } 
    else {
      this.includeIngredientsPlaceholder = "Subscribe to Premium to Include Ingredients";
      this.excludeIngredientsPlaceholder = "Subscribe to Premium to Exclude Ingredients";
      this.ultraResultsNumberText = "Upgrade for 100";
      this.premiumResultsNumberText = "Upgrade for 50";
      this.randomCheckboxText = "- Upgrade Plan to Use"
      this.maxNumResults = 10; 
    } 
  }

  async getCustomClaimRole() {

    this.auth.user.subscribe(async res => {
      res.getIdToken(true);
      const decodedToken = await res.getIdTokenResult();
      console.log(decodedToken.claims.stripeRole);
      this.role = decodedToken.claims.stripeRole;
      this.initializePlaceholders();
      return decodedToken.claims.stripeRole;
    });
  }

  ngOnInit(): void {
    this.getCustomClaimRole();
    this.loadListIfPresent();
    this.getSavedRecipes();
  }

}
