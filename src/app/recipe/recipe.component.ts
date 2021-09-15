import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from "@angular/router";
import { SearchService } from '../search.service';
import { faHeart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common'

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
  priceWidgetHtml: string;
  role: string;

  constructor(private readonly route: ActivatedRoute, private readonly searchService: SearchService,
              public auth: AngularFireAuth, private readonly afs: AngularFirestore, private location: Location,
              private router: Router) {
                
               }

  saveRecipe(): void {

    this.auth.user.subscribe(res => {

      if (res == null || res == undefined) {
        this.router.navigate(['/login']);
        return;
      }

      this.userId = res.uid;
      this.afs.collection(`user/${this.userId}/savedRecipes`).doc(this.recipeId).set({'recipeId': this.recipeId});
      // var doc = this.afs.doc(`user/${this.userId}`);
      // var savedRecipes = doc.collection('savedRecipes');
      // var test = savedRecipes.valueChanges().subscribe(res => {
      //   res.forEach(x => {
      //     console.log(x.recipeId);
      //   })
      // })
      // console.log("Saved Recipes: " + savedRecipes[0]);
      // console.log("test: " + test);
    });

    console.log("test")
  }

  goBack(): void {
    this.location.back();
  }

  async subscribeToPremium() {


    this.auth.user.subscribe(async res => {
      const docRef = await this.afs
  .collection('user')
  .doc(res.uid)
  .collection('checkout_sessions')
  .add({
    price: 'price_1JQ3nfK1Gx30f6PHHaywcsEv',
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });
// Wait for the CheckoutSession to get attached by the extension
docRef.onSnapshot((snap) => {
  const { error, url } = snap.data();
  if (error) {
    // Show an error to your customer and 
    // inspect your Cloud Function logs in the Firebase console.
    alert(`An error occured: ${error.message}`);
  }
  if (url) {
    // We have a Stripe Checkout URL, let's redirect.
    window.location.assign(url);
  }
});
    });



    
  }

  async getCustomClaimRole() {

    this.auth.user.subscribe(async res => {
      res.getIdToken(true);
      const decodedToken = await res.getIdTokenResult();
      console.log(decodedToken.claims.stripeRole);
      this.role = decodedToken.claims.stripeRole;
      return decodedToken.claims.stripeRole;
    });
  }

  getRecipe(recipeId: string) {
    this.searchService.getRecipe(recipeId).subscribe((data: string ) => {
      var response = data;
     
      this.recipe = JSON.parse(JSON.stringify(response));
      console.log(this.recipe);
      this.getRecipeNutritionWidget();
      this.getRecipePriceWidget();
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

  getRecipePriceWidget(): void {

    this.searchService.getRecipePriceWidget(this.recipeId).subscribe((data: string ) => {
      var response = data;
    
      this.priceWidgetHtml = JSON.parse(JSON.stringify(response));

      console.log(this.priceWidgetHtml);
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
    this.getCustomClaimRole();
    
    //this.getRecipeInstructions(this.recipeId);
  }

}
