import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecipesListComponent } from './recipes-list/recipes-list.component';

import { SearchService } from './search.service';
import { HttpClientModule } from '@angular/common/http';
import { LandingComponent } from './landing/landing.component';
import { RecipeComponent } from './recipe/recipe.component';
import { LoginComponent } from './login/login.component'
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProfileComponent } from './profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContactComponent } from './contact/contact.component';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";
import { SafeHtmlPipe } from './pipes/sanitizer.pipe';


@NgModule({
  declarations: [
    AppComponent,
    RecipesListComponent,
    LandingComponent,
    RecipeComponent,
    LoginComponent,
    ProfileComponent,
    ContactComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    FontAwesomeModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  exports: [
    SafeHtmlPipe
  ],
  providers: [SearchService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
