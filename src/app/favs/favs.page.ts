import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// FIREBASE SERVICE
import { FirestoreService } from '../servicios/firestore.service';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/firestore';

//SEARCH BAR DATA SERVICE
import { DataService } from '../servicios/data.service';

// IONIC STORAGE
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';


import { DataLocalService } from '../servicios/data-local.service';
import { NavController } from '@ionic/angular';

import { Router } from '@angular/router';
import { NavparamService } from '../navparam.service';

@Component({
  selector: 'app-favs',
  templateUrl: './favs.page.html',
  styleUrls: ['./favs.page.scss'],
})

export class FavsPage implements OnInit {



  noticias: Article[] = [];
  title:string;

  constructor(private activatedRoute: ActivatedRoute, 
     public dataLocalService: DataLocalService,
     public storage: Storage,
     private navCtrl: NavController,
     private router: Router,
     private navParamService: NavparamService
     ) {
   
   }

  gotoNoticia(noticia: Article) {

     
 
//    this.router.navigate(['details/'+ {'noticia':noticia }])

    this.navParamService.setNavData(noticia);
    this.router.navigate(['details/Favoritos'])

  }
  ngOnInit() {

    this.cargarFavoritos();
    
  }

  async cargarFavoritos() {

    const favoritos = await this.storage.get('favoritos');
    console.log(favoritos)
      if ( favoritos) {
      this.noticias = favoritos;
    }
    }





}
