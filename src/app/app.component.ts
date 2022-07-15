import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loggedIn: boolean = false
  title = 'Welcome to orderX';
  constructor(private firestore: AngularFirestore, 
              private auth: AngularFireAuth,
              private router: Router){
  }

  ngOnInit(){
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }

  async logout() {
    localStorage.clear();
    await this.auth.signOut();
    this.router.navigateByUrl("/");
  }
}
