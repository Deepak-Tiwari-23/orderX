import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  _id:string;
  registerationForm:any;

  @Output() completed = new EventEmitter<void>();

  @Input()
  set id(value) {
    this._id = value;
    console.log(this._id)
  }

  constructor(private fb: FormBuilder,
              private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.registerationForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required]
    })
  }


  // function to check the validity of input fields
  hasErrors(formControlName) {
    var result = false;
    result = this.registerationForm['controls'][formControlName].invalid;
    return result;
  }

  // function to get the error of input fields.
  getErrorMessage(formControlName) {
    var errors = this.registerationForm['controls'][formControlName].errors;
    var errorString;
    if (errors['required'])
      errorString = "This field is Required";
    return errorString;
  }

  register(){
    // checking if the input fields are entered or not
    let isNameNotFilled:boolean = this.hasErrors('name');
    let isPhoneNotFilled:boolean = this.hasErrors('phoneNumber');
    let isAddressNotFilled:boolean = this.hasErrors('address');
    if(isNameNotFilled || isPhoneNotFilled || isAddressNotFilled){
      console.log('fields not entered')
      return
    }

    let data: any = this.registerationForm.value;

    let userRef = this.firestore.collection('users').doc(this._id);
    userRef.update({
      registered:true,
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address
    }).then(()=>{

      this.completed.emit();
    })

  }
}
