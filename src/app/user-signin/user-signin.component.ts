import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-signin',
  templateUrl: './user-signin.component.html',
  styleUrls: ['./user-signin.component.css']
})
export class UserSigninComponent implements OnInit {
  signinForm: any;
  signInOption: any;
  showForm: boolean = false;
  rememberMe: boolean = false;

  constructor(private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private ngZone: NgZone,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })
  }

  // function to check the validity of input fields
  hasErrors(formControlName) {
    var result = false;
    result = this.signinForm['controls'][formControlName].invalid;
    return result;
  }

  // function to get the error of input fields.
  getErrorMessage(formControlName) {
    var errors = this.signinForm['controls'][formControlName].errors;
    var errorString;
    if (errors['required'])
      errorString = "This field is Required";
    return errorString;
  }


  // function to toggle between signin and signup
  setSignInOption(value) {
    this.showForm = true;
    this.signInOption = value;
  }

  // function to set the value of remember me check box.
  rememberMeToggle() {
    if (this.rememberMe == false)
      this.rememberMe = true;
    else
      this.rememberMe = false;

    console.log('remember me ', this.rememberMe)
  }

  // function to sign up the new user
  signUpMethod() {
    let data: any = this.signinForm.value;
    console.log(data)

    // checking if the input fields are entered or not
    let isEmailNotFilled:boolean = this.hasErrors('email');
    let isPasswordNotFilled:boolean = this.hasErrors('password');
    if(isEmailNotFilled || isPasswordNotFilled){
      console.log('fields not entered')
      return
    }

    // signing up the user
    this.auth.createUserWithEmailAndPassword(data.email, data.password).then((result) => {
      let message = "You have successfully created your account."
      this.toastr.success(message, "Congratulations")

      if (this.rememberMe == false)
        this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      else
        this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      //Check if user is already registered.
      this.checkIfRegisteredUser(result.user);
    }).catch(err => {
      console.log('error during signup ', err)
    })
  }


  // function to signin the existing user
  signInMethod() {
    let data: any = this.signinForm.value;

    // checking if the input fields are entered or not
    let isEmailNotFilled:boolean = this.hasErrors('email');
    let isPasswordNotFilled:boolean = this.hasErrors('password');
    if(isEmailNotFilled || isPasswordNotFilled){
      console.log('fields not entered')
      return
    }

    // signing in the user
    this.auth.signInWithEmailAndPassword(data.email, data.password).then((result) => {
      if (this.rememberMe == false)
        this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      else
        this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      //Check if user is already registered.
      this.checkIfRegisteredUser(result.user);
    }).catch(err => {
      console.log('error during signin ', err)
    })
  }



  public checkIfRegisteredUser = (user): Promise<string | void> => {
    if (user) {
      // storing the auth details in local storage
      localStorage.setItem('userId', user.uid);

      var userRef = this.firestore.collection('users').doc(user.uid);
      return userRef.get().toPromise().then(this.onUser).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
  }

  public onUser = (result): any => {
    if (result.exists) {
      var user = result.data();
      console.log('user  ', user)
      // If user is already registered redirect to the dashboard
      if (user['registered']) {
        this.ngZone.run(() => this.router.navigateByUrl("/dashboard"));

      } else if (!user['registered']) {
        this.ngZone.run(() => this.router.navigateByUrl("/register"));
      }
    } else {
      // creatin a new user document
      this.createNewUser();
    }
  }


  // function to create a new use document
  async createNewUser(){
    let usersRef = this.firestore.collection('users');
    const id = await firebase.auth().currentUser.uid;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    usersRef.doc(id).set({
      id: id,
      registered: false,
      createdOn: timestamp,
      createdBy: id
    }).then(()=>{
      // taking the new user to registeration page.
      this.ngZone.run(() => this.router.navigateByUrl("/register"));
    }).catch(function (error) {
      console.error("Error creating User: ", error);
    });
  }

}
