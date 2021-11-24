import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipesListComponent } from './recipes-list/recipes-list.component';

const routes: Routes = [ 
  { path: '', component: LandingComponent },
  { path: 'recipes', component: RecipesListComponent },
  { path: 'recipe/:recipeId', component: RecipeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'landing', component: LandingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
