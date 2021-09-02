import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

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
  faHeart = faHeart;
  recipeIdToDelete = "";

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
      this.router.navigate(['/login']);
    });
  }

  getNutrientInfo(nutrient: string, recipe: any) {
    var nutrientObject = recipe.nutrition.nutrients.find(x => x.name == nutrient);
    var result: string;

    if (nutrientObject != null && nutrientObject != undefined) {
      result = nutrientObject?.amount?.toString().concat(nutrientObject?.unit?.toString());
    } 
    else {
      result = "";
    }


    return result;
  }

  setRecipeIdToDelete(recipeId: string): void {
    this.recipeIdToDelete = recipeId;
  }

  deleteRecipe(): void {
    this.auth.user.subscribe(res => {
      this.userId = res.uid;

      this.afs.doc(`user/${this.userId}/savedRecipes/${this.recipeIdToDelete}`).delete().then(res => {
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

  async getCustomClaimRole() {

    this.auth.user.subscribe(async res => {
      res.getIdToken(true);
      const decodedToken = await res.getIdTokenResult();
      console.log(decodedToken.claims.stripeRole);
      return decodedToken.claims.stripeRole;
    });

    (await this.auth.currentUser).getIdToken(true);
    const decodedToken = (await this.auth.currentUser).getIdTokenResult();
    console.log((await decodedToken).claims.stripeRole)
    return (await decodedToken).claims.stripeRole;
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

  ngOnInit(): void {
  //this.getCustomClaimRole();
  //this.subscribeToPremium()
  this.populateSavedRecipeIds(); 

  }

}
