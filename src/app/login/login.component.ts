import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AngularFireAuth) { }

  email: string;
  password: string;
  phoneNumber: string;

  signUpEmail() {
    this.auth.createUserWithEmailAndPassword(this.email, this.password);
  }

  loginEmail() {
    this.auth.signInWithEmailAndPassword(this.email, this.password);
  }

  loginFacebook() {
    this.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  }

  loginGithub() {
    this.auth.signInWithRedirect(new firebase.auth.GithubAuthProvider());
  }

  loginTwitter() {
    this.auth.signInWithRedirect(new firebase.auth.TwitterAuthProvider());
  }

  loginGoogle() {
    this.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.auth.signOut();
  }

  ngOnInit(): void {
    
  }

}

