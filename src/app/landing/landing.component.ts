import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(public auth: AngularFireAuth, private readonly afs: AngularFirestore) { }

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

  async subscribeToUltra() {


    this.auth.user.subscribe(async res => {
      const docRef = await this.afs
  .collection('user')
  .doc(res.uid)
  .collection('checkout_sessions')
  .add({
    price: 'price_1JwezmK1Gx30f6PHJ6JLvHzK',
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
  }

}
