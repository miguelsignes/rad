import { Component, OnInit } from '@angular/core';

import { MenuController, Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from './fcm.service';

import { Usuario } from './interfaces/interfaces';
// FIREBASE SERVICE
import { FirestoreService } from './servicios/firestore.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { menuController } from "@ionic/core"; 
import { UsuarioService } from './usuario.service';

import { Observable } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public selectedIndex = 0;
  private nameValue$: Observable<String>;
  public myName:String = '';
  public textValue:String = 'Logg inn';

  public loginApp = 
    {
      title: 'Login',
      url: '/login'
    }
  public loginout = {
    title: 'Log out',
    url: '/logout'
  }
  public appDoc = [
    {
      title: 'Om appen',
      url: '/omappen',
      icon: 'alert-circle'
    },
    {
      title: 'Kontakt oss',
      url: '/kontakt',
      icon: 'mail'
    },
  ]
  public appPages = [
    {
      title: 'Hjem',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Kommuner/fylkeskommuner',
      url: '/folder',
      icon: 'business'
    },
    {
      title: 'Helseforetak',
      url: '/gestion',
      icon: 'medkit'
    },
    {
      title: 'NAV',
      url: '/nav',
      icon: 'file-tray-full'
    },
    {
      title: 'Inspirasjon',
      url: '/inspirasjon',
      icon: 'bulb'
    },
    {
      title: 'Favoritter',
      url: '/fav',
      icon: 'bookmark'
    },
    {
      title: 'Om appen',
      url: '/omappen',
      icon: 'alert-circle'
    },
    {
      title: 'Kontakt oss',
      url: '/kontakt',
      icon: 'mail'
    },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcmService: FcmService,
    private menu: MenuController,
    private userService: UsuarioService,
    private navCtrl: NavController
  ) {
    this.initializeApp();

  }

  openFirst() {
    
    this.menu.close();
  }



  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.fcmService.initPush();
  }

  readStorageName() {

  this.userService.readStorage()
  }

  

  ngOnInit() {




  this.readStorageName()

    this.nameValue$ = this.userService.nameSubject.asObservable();
    console.log(this.nameValue$);
    this.nameValue$.subscribe(value => this.myName = value);
    console.log('My NAME', this.myName);
   
  

    
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
