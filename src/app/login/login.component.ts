import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private readonly route: ActivatedRoute, public auth: AngularFireAuth, private router: Router) { }

  userId: string;
  showPage: boolean = false;
  firebaseUi: any;
  returnUrl: string;
  extraTextInfo: string;
  

  checkIfAlreadyLoggedIn(): void {
    this.auth.user.subscribe(res => {

      if (res != null && res != undefined) {
        this.router.navigate(['landing'], { fragment: 'pricing'});
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
      signInSuccessUrl: this.returnUrl,
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

  // setReturnUrl(): void {
  //   if (this.route.snapshot.queryParamMap.get("previousPage") == 'landing') {
  //     this.returnUrl = "landing#pricing";
  //   } 
  //   else if (this.route.snapshot.queryParamMap.get("previousPage") == 'saveAttempt') {
  //     this.returnUrl = "recipes"
  //   }
  //   else {
  //     this.returnUrl = "profile"
  //   }
  // }

  // always redirect to pricing for now
  setReturnUrl(): void {
    this.returnUrl = "landing";
  }

  setExtraTextInfo(): void {
    let x = this.route.snapshot.queryParamMap.get("previousPage");
    if (this.route.snapshot.queryParamMap.get("previousPage") == 'landing') {
      this.extraTextInfo = "You Must Login Before Selecting a Plan";
    } 
    else if (this.route.snapshot.queryParamMap.get("previousPage") == 'saveAttempt') {
      this.extraTextInfo = "You Must Login to Save a Recipe"
    }
    
  }

  ngOnInit(): void {
    this.checkIfAlreadyLoggedIn();
    this.initializeFirebaseUi();
    this.setReturnUrl();
    //this.setExtraTextInfo();
 
  }
}

