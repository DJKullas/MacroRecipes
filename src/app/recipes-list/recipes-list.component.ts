import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {

  query: string = "apple pie";
  response: string;
  minCarbs: number;
  maxCarbs: number;
  minFat: number;
  maxFat: number;
  minProtein: number;
  maxProtein: number;
  minCalories: number;
  maxCalories: number;

  recipes: Object[];

  constructor(private readonly searchService: SearchService, private readonly sanitizer: DomSanitizer) { }

  search() {
    this.searchService.search(this.query).subscribe((data: string ) => {
      this.response = data;
      console.log("response")
      console.log(this.response);
      },
    error => {
      console.log("DEF");

    });
  }

  searchByMacros() {
    this.searchService.searchByMacros(this.minCarbs?.toString(), this.maxCarbs?.toString(), 
                                      this.minFat?.toString(), this.maxFat?.toString(),
                                      this.minProtein?.toString(), this.maxProtein?.toString(),
                                      this.minCalories?.toString(), this.maxCalories?.toString()).subscribe((data: string ) => {
      this.response = data;
      console.log("response Macros")
      console.log(this.response);

      this.recipes = JSON.parse(JSON.stringify(this.response));
      localStorage.removeItem('recipes');
      localStorage.setItem('recipes', JSON.stringify(this.recipes));
      },
    error => {
      console.log("DEF");

    });
  }

  sanitize(url: string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  loadListIfPresent(): void {
    this.recipes = JSON.parse(localStorage.getItem('recipes'));
  }

  ngOnInit(): void {
    this.loadListIfPresent();
  }

}
