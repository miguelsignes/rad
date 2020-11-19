import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';
import { NavparamService } from '../navparam.service';
import { Article } from '../interfaces/interfaces';
import { DataService } from '../servicios/data.service';
import { DataLocalService } from '../servicios/data-local.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  noticia: Article[] = [];
  data:any;
  estrella = 'bookmark-outline';
  idx:string;
  existe:Boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private storage: Storage, public dataLocalService: DataLocalService,   private navParamService: NavparamService) { }


  ngOnInit() {



    this.route.paramMap.subscribe(params => {
     this.idx = params.get('idx');
      console.log(this.idx);
   });

  this.data = this.navParamService.getNavData()
  console.log(this.data)

  this.cargarFavoritos()
  }

  clickFav(item) {
    
   console.log(item); 
   if (this.estrella === 'bookmark-outline')
    {
    this.estrella = 'bookmark';
   } else {
     this.estrella = 'bookmark-outline'
   }
   this.dataLocalService.guardarNoticia(item);

    
  }

  favorito() {

   
   // console.log(this.idx);
   // const existe = this.dataLocalService.guardarNoticia(this.data);
   // console.log(existe);
   // this.estrella = ( existe ) ? 'bookmark' : 'bookmark-outline';
  }


async cargarFavoritos() {
  let favoritos = undefined;
  favoritos = await this.storage.get('favoritos');
  
  
  for ( const noti of favoritos) {

    if ( noti.id === this.data.id) 
    {
      this.existe = true;
      this.estrella = 'bookmark';
      break;
    }

  }



  }


}
