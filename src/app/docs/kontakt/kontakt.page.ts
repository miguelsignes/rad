import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kontakt',
  templateUrl: './kontakt.page.html',
  styleUrls: ['./kontakt.page.scss'],
})
export class KontaktPage implements OnInit {

  imgSrc:String = '../../../assets/images/paris.jpg';
  
  constructor() { }

  ngOnInit() {
  }

}
