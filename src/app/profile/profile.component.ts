import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public auth: AngularFireAuth, private readonly afs: AngularFirestore) { }

  savedRecipes: any[] = [];
  savedRecipeIds: string[] = [];
  userId: string;

  populateSavedRecipeIds(): void {
    this.auth.user.subscribe(res => {
      this.userId = res.uid;
      var doc = this.afs.doc(`user/${this.userId}`);
      var savedRecipes = doc.collection('savedRecipes');
      savedRecipes.valueChanges().subscribe(res => {
        this.addIdsToList(res);
      })
    });
  }

  addIdsToList(res: any) {
    res.forEach(recipe => {
      this.savedRecipeIds.push(recipe.recipeId)
    });
    console.log("Saved Recipes: " + this.savedRecipeIds);
  }


  ngOnInit(): void {
  this.populateSavedRecipeIds(); 

  }

}
