import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  user:any;
  registered:boolean;
  verified:boolean;
 

  constructor(private fb: FormBuilder, 
              private firestore: AngularFirestore,
              private auth: AngularFireAuth,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user=>{
      if(user){
        //Check if registration form already exists
        this.getUser(user);
       }
    })
  }


  getUser(user){
    var id = user.uid;
    var docRef = this.firestore.collection("users").doc(id);
    docRef.get().subscribe(this.onUserResult);
  }

  onUserResult = (result)=>{
    if(result.exists){
      let user:any = result.data();
      this.user = user;
      if('registered' in user){
        this.registered = user['registered'];
      }
    }      
    return this.user;
  }

  onCompleted(){ 
    let message = "You have successfully registered with us."
    this.toastr.success(message, "Congratulations")   
    this.router.navigateByUrl("/dashboard")
  }
}
