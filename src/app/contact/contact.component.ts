import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { SearchService } from '../search.service';

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

  constructor(private readonly searchService: SearchService) { }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  sendEmail(): void {
    if (this.recaptcha != undefined || this.recaptcha != null) {

      this.searchService.sendEmail(this.name, this.email, this.message).subscribe((data: string ) => {
       
        console.log("response")
        console.log(data);
        alert("Form submitted successfully!");
        this.message = "";
        this.email = "";
        this.name = "";
        },
      error => {
        console.log("DEF");
        alert("Error sending email!");
  
      });
      console.log("AFTER SERVICE CALL")
    }
  }

  ngOnInit(): void {
  }

}
