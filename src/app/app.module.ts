import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//  firebase imports, remove what you don't require
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';


// environment
import { environment } from '../environments/environment';

// Storage LOCAL 

import { IonicStorageModule } from '@ionic/storage';
// NAVPARAMS

import  { NavparamService } from './navparam.service';

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
driverOrder: ['localstorage']
    })
  ],
  providers: [
    YoutubeVideoPlayer,
    StatusBar,
    SplashScreen,
    NavparamService,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
