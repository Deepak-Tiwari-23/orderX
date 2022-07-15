import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.css'],
})
export class OrderDialogComponent implements OnInit {
  orderForm:any;

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<OrderDialogComponent>,
      @Inject (MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      productName: ['', Validators.required],
      orderDueDate: ['', Validators.required],
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required],
      customerAddress: ['', Validators.required],
      amount: ['', Validators.required]
    })

    if(this.data){
      console.log('existing order ', this.data);

      let formData = {
        productName: this.data.productName,
        orderDueDate: this.data.orderDueDate.toDate(),
        customerName: this.data.customerName,
        customerPhone: this.data.customerPhone,
        customerAddress: this.data.customerAddress,
        amount: this.data.amount
      }

      // setting the value of order form for an existing order
      this.orderForm.setValue(formData)
    }
  }

  // function to check the validity of input fields
  hasErrors(formControlName) {
    var result = false;
    result = this.orderForm['controls'][formControlName].invalid;
    return result;
  }

  // function to get the error of input fields.
  getErrorMessage(formControlName) {
    var errors = this.orderForm['controls'][formControlName].errors;
    var errorString;
    if (errors['required'])
      errorString = "This field is Required";
    return errorString;
  }

  checkForAllInputFields(){
    // checking if all the input fields are entered or not
    let isProductNameNotFilled:boolean = this.hasErrors('productName');
    let isOrderDueDateNotFilled:boolean = this.hasErrors('orderDueDate');
    let iscustomerNameNotFilled:boolean = this.hasErrors('customerName');
    let iscustomerPhoneNotFilled:boolean = this.hasErrors('customerPhone');
    let iscustomerAddressNotFilled:boolean = this.hasErrors('customerAddress');
    let isamountNotFilled:boolean = this.hasErrors('amount');

    if(isProductNameNotFilled || isOrderDueDateNotFilled || iscustomerNameNotFilled || iscustomerPhoneNotFilled || iscustomerAddressNotFilled || isamountNotFilled){
      return false;
    } else {
      return true;
    }
  }

  // function to create order
  createOrder(){
    // checking if all inputs are filled or not.
    let isAllInputFieldsFilled:boolean = this.checkForAllInputFields();
    if(!isAllInputFieldsFilled){
      console.log('all fields not filled');
      return;
    }

    let data:any = this.orderForm.value;
    this.dialogRef.close({ 
      event: "Yes", 
      productName: data.productName,
      orderDueDate: data.orderDueDate,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      amount: data.amount
    })
  }

  // function to close dialog box
  close(){
    this.dialogRef.close();
  }

}
