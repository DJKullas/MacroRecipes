import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  name: string;
  email: string;
  message: string;
  recaptcha: any;

  constructor() { }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  sendEmail(): void {
    if (this.recaptcha != undefined || this.recaptcha != null) {

    }
    
  }

  ngOnInit(): void {
  }

}
