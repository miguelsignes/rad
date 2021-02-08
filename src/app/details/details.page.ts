import { Component, OnInit, OnDestroy,AfterViewInit  } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';
import { NavparamService } from '../navparam.service';
import { Article } from '../interfaces/interfaces';
import { DataLocalService } from '../servicios/data-local.service';
import { Storage } from '@ionic/storage';
import * as firebase from "firebase/app";
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { first, tap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

//VIDEO

//import { YoutubePlayerWeb } from 'capacitor-youtube-player'; // Web version

//import { Plugins, Capacitor } from '@capacitor/core'; // Native version


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
  categoriIcon: String = 'star';
  cardCollectionSubscription;
  favoritos: any = [];
  width:string;
  video:boolean = true;
  imgSrc:String = '../../../assets/video.png';
  
  private cardCollection: AngularFirestoreCollection<Article>;
  
  constructor(private youtube: YoutubeVideoPlayer,private route: ActivatedRoute, private plat:Platform, private storage: Storage, public dataLocalService: DataLocalService,  private navParamService: NavparamService, private afs: AngularFirestore, private afu:AngularFireAuth) { }


  ngAfterViewInit() {
/*
    if (Capacitor.platform === 'web') {
      this.initializeYoutubePlayerPluginWeb();
    } else { // Native
      this.initializeYoutubePlayerPluginNative();
    }
*/
  }

 /*
  async initializeYoutubePlayerPluginWeb() {
    const options = {playerId: 'youtube-player', playerSize: {width: 640, height: 360}, videoId: 'vJ5v7jjTd-I', debug: true};
    const result = await YoutubePlayerWeb.initialize(options);
}

async destroyYoutubePlayerPluginWeb() {
  const result = await YoutubePlayerWeb.destroy('youtube-player');
  console.log('destroyYoutubePlayer', result);
}


async initializeYoutubePlayerPluginNative() {

  const { YoutubePlayer } = Plugins;

  const options = { videoId: 'vJ5v7jjTd-I', debug: true, fullscreen:false,  playerSize: {width: 640, height: 360}};

  const playerReady = await YoutubePlayer.initialize(options);


}

*/
  ngOnDestroy() {
   
    
  }
  isLoggedIn() {
    return this.afu.authState.pipe(first())
 }

 onClickVideo(item) {
  this.youtube.openVideo(item);
 }
  ngOnInit() {

  //console.log(this.plat.width);
  //console.log(this.plat.height);

  this.route.paramMap.subscribe(params => {

    let str = params.get('idx');
   
    this.idx = str[0].toUpperCase()+str.slice(1);
      
   });

  this.data = this.navParamService.getNavData()

  if (this.data.categoria == 'Kommuner/fylkeskommuner') {
    this.data.categoria = 'Kommuner'
  }
  if (this.data.categoria == 'NAV') 
  {
    this.categoriIcon = "bookmark"
  }

    this.discriminarFavoritos()

  }

  clickFav(item) {



   if (this.estrella === 'bookmark-outline')
    {
    this.estrella = 'bookmark';
   } else {
     this.estrella = 'bookmark-outline'
   }


   this.isLoggedIn().pipe(
    tap(user => {
      if (user) {

        this.dataLocalService.guardarNoticiaFirebase(item);
      } else {
        
        this.dataLocalService.guardarNoticiaStorage(item);
      }
    })
  )
  .subscribe()
   /*
   firebase.auth().onAuthStateChanged( (user) => {
   
    if ( user ) {

      this.dataLocalService.guardarNoticiaFirebase(item);

    } else {

      this.dataLocalService.guardarNoticiaStorage(item);
    }
  })
    */
     
    }


 
// Esto carga Favoritos simplemente para poner la estrella
async cargarFavoritos() {


  this.favoritos = await this.storage.get('favoritos');
  
  if (this.favoritos == null || this.favoritos.length == 0)
  {
    return;

  }  else {

    for ( const noti of this.favoritos) {

      if ( noti.id === this.data.id) 
      {
        this.existe = true;
        this.estrella = 'bookmark';
        break;
      }
  
    }
  }



  }


  discriminarFavoritos() {



    
   this.isLoggedIn().pipe(
    tap(user => {
      if (user) {

        this.cargarFavoritosFirebase()
      } else {
        
        this.cargarFavoritos()
      }
    })
  )
  .subscribe()

  }

  playVideo() {
    
    //this.youtube.openVideo('Om1YzNegZfs');
  }

   cargarFavoritosFirebase() {


    this.noticia = [];
    
    let theuser = firebase.auth().currentUser.uid;

        this.cardCollection = this.afs.collection('dataSaved', ref =>  {
          return ref.where('userUid', '==', theuser)
        })

     

        this.favoritos =  this.cardCollection.snapshotChanges().pipe(
        map(actions => actions.map( a=> {
          const data = a.payload.doc.data() as Article;
          const id = a.payload.doc.id;
      
          return { id, ...data}
        })
        )

     

      ).subscribe( (data) => {
    

        this.noticia = data || [];
        console.log(this.noticia);

        for ( const noti of this.noticia) {
      
          if ( noti.id === this.data.id) 
          {
           
            
            this.existe = true;
            console.log(this.existe)
            this.estrella = 'bookmark';
            return;
          }
      
        }

      console.log('LLegamos aquí?')
      })
     
  }
}
