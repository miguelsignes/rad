import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-omappen',
  templateUrl: './omappen.page.html',
  styleUrls: ['./omappen.page.scss'],
})


export class OmappenPage implements OnInit {

  imgSrc:String = '../../../assets/images/paris.jpg';
  
  constructor() { }

  ngOnInit() {
  }

}
