import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { faLemon } from '@fortawesome/free-regular-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faStopCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  faClock = faClock;
  faLemon = faLemon;
  faChartBar = faChartBar;
  faStopCircle = faStopCircle;


  constructor(public auth: AngularFireAuth, private readonly afs: AngularFirestore, private router: Router) { }

  async subscribeToPremium() {


    this.auth.user.subscribe(async res => {

      if (res == null || res == undefined) {
        this.router.navigate(['login'], { queryParams: { previousPage: 'landing' } });
        return;
      }

      this.showRedirectingToPayment();

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
    location.reload();
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

      if (res == null || res == undefined) {

     
          this.router.navigate(['login'], { queryParams: { previousPage: 'landing' } });
   
        return;
      }

      this.showRedirectingToPayment();

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
    location.reload();
  }
  if (url) {
    // We have a Stripe Checkout URL, let's redirect.
    window.location.assign(url);
  }
});
    });
  
  }

  showRedirectingToPayment(): void {
    document.getElementsByClassName("container")[0].innerHTML = '<h1 style="text-align: center;">Redirecting you to our secure payment proccesor.<h1><div class="text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';

  }

  ngOnInit(): void {
  }

}
