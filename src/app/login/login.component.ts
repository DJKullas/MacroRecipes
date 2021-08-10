import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AngularFireAuth, private router: Router) { }

  userId: string;
  showPage: boolean = false;
  firebaseUi: any;

  checkIfAlreadyLoggedIn(): void {
    this.auth.user.subscribe(res => {

      if (res != null && res != undefined) {
        this.router.navigate(['/profile']);
      } else {
        this.showPage = true;
      }
      
    }, err => {
      this.router.navigate(['/login']);
    });
  }
  

  logout(): void {
    this.auth.signOut();
  }

  initializeFirebaseUi(): void {
    
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      signInSuccessUrl: 'http://localhost:5000/profile',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      tosUrl: '<your-tos-url>',
      // Privacy policy url.
      privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    this.firebaseUi = new firebaseui.auth.AuthUI(firebase.auth());
    this.firebaseUi.start('#firebaseui-auth-container', uiConfig);
  }

  ngOnInit(): void {
    this.checkIfAlreadyLoggedIn();
    this.initializeFirebaseUi();
 
  }
}

