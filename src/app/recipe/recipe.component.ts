import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from "@angular/router";
import { SearchService } from '../search.service';
import { faHeart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common'
import { faHeart as faHeart2 } from '@fortawesome/free-regular-svg-icons';

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
  maxFreeSaves: number = 5;
  maxPremiumSaves: number = 20;
  maxUltraSaves: number = 50;
  allowedToAddMoreRecipes = true;
  faHeart2 = faHeart2;
  isRecipeSaved: boolean = false;

  constructor(private readonly route: ActivatedRoute, private readonly searchService: SearchService,
              public auth: AngularFireAuth, private readonly afs: AngularFirestore, private location: Location,
              private router: Router) {
                
               }

  checkIfRecipeSaved() {

    var doc = this.afs.doc(`user/${this.userId}`);
    var savedRecipeCollection = doc.collection('savedRecipes');
    savedRecipeCollection.valueChanges().subscribe(res => {

      if (this.role == 'ultra' && res.length >= this.maxUltraSaves) {
        this.allowedToAddMoreRecipes = false;
      } 
      else if (this.role == 'premium' && res.length >= this.maxPremiumSaves) {
        this.allowedToAddMoreRecipes = false;
      } 
      else if (this.role != 'premium' && this.role != 'ultra' && res.length >= this.maxFreeSaves) {
        this.allowedToAddMoreRecipes = false;
      }
      else {
        this.allowedToAddMoreRecipes = true;
      }


      res.forEach(recipe => {

        if (this.recipeId == recipe.recipeId) {
          this.isRecipeSaved = true;
          return;
        }
      });
    })
  }

  saveRecipe(): void {

      if (!this.userId) {
        this.router.navigate(['/login'], { queryParams: { previousPage: 'saveAttempt' } });
            return;
      } 

      if (!this.allowedToAddMoreRecipes) {
        document.getElementById("showModal").click();
        return;
      }
      else {
        let idNumber = Number(this.recipeId);
        this.afs.collection(`user/${this.userId}/savedRecipes`).doc(this.recipeId.toString()).set({'recipeId': idNumber});
        this.isRecipeSaved = true;
      }
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

      var el = document.createElement("script");
      el.setAttribute("type", "text/javascript");
      el.setAttribute("src", "https://code.jquery.com/jquery-1.9.1.min.js");
      var widget: any = document.getElementById('nutritionWidget');
      widget.contentDocument.head.appendChild(el);

      el = document.createElement("script");
      el.setAttribute("type", "text/javascript");
      el.setAttribute("src", "https://spoonacular.com/application/frontend/js/jquery.canvasjs.min");
      widget.contentDocument.head.appendChild(el);

      // wait until jquery is loaded
      setTimeout(function () {
          var widget: any = document.getElementById('nutritionWidget');
          var iframeDocument = widget.contentDocument;
          iframeDocument.open();
          iframeDocument.write(response);
          iframeDocument.close();

          var el = document.createElement("script");
          el.setAttribute("type", "text/javascript");
          el.setAttribute("src", "https://spoonacular.com/application/frontend/js/nutritionWidget.min.js?c=1");
         widget.contentDocument.body.appendChild(el);
      }, 1000);
    },
    error => {
      console.log("DEF");

    });
  }

  getRecipePriceWidget(): void {

    this.searchService.getRecipePriceWidget(this.recipeId).subscribe((data: string ) => {
      var response = data;
    
      this.priceWidgetHtml = JSON.parse(JSON.stringify(response));

      var el = document.createElement("script");
      el.setAttribute("type", "text/javascript");
      el.setAttribute("src", "https://code.jquery.com/jquery-1.9.1.min.js");
      var widget: any = document.getElementById('priceWidget')
      widget.contentDocument.head.appendChild(el);

      el = document.createElement("script");
      el.setAttribute("type", "text/javascript");
      el.setAttribute("src", "https://spoonacular.com/application/frontend/js/jquery.canvasjs.min");
      widget.contentDocument.head.appendChild(el);

      // wait until jquery is loaded
      setTimeout(function () {
          var widget: any = document.getElementById('priceWidget')
          var el = document.createElement("script");
          el.setAttribute("type", "text/javascript");
          el.setAttribute("src", "https://spoonacular.com/application/frontend/js/ingredientWidget.min.js?c=1");
          widget.contentDocument.body.appendChild(el);

          var iframeDocument = widget.contentDocument;
          iframeDocument.open();
          iframeDocument.write(response);
          iframeDocument.close();
      }, 1000);

      console.log(this.priceWidgetHtml);
      },
    error => {
      console.log("DEF");

    });
  }

  deleteRecipe(recipeId: string): void {
    this.auth.user.subscribe(res => {
      this.userId = res.uid;

      this.afs.doc(`user/${this.userId}/savedRecipes/${recipeId}`).delete().then(res => {
        this.isRecipeSaved = false;
      });
    });
  }

  convertToFraction(decimal: number): number {
    var result = fracty(decimal);
    return result;
  }

  getUserId() {
    this.auth.user.subscribe(res => {

      if (res == null || res == undefined) {
        this.getRecipe(this.recipeId);
        return;
      }

      this.userId = res.uid;
      this.getRecipe(this.recipeId);
      this.getCustomClaimRole();
      this.checkIfRecipeSaved();
    });
  }

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get("recipeId");
    //this.getRecipeInstructions(this.recipeId);
  }

  ngAfterViewInit(): void {
    this.getUserId();
  }

}
