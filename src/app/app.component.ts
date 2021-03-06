import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MacroRecipes';

  constructor(public auth: AngularFireAuth, private router: Router) { }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

}
