import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';
import { OrdersServiceService } from '../services/orders-service.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  orderSub: Subscription;
  noOrders: boolean = false;
  orderList: AngularFirestoreDocument[] = [];
  user: any;

  constructor(private orderService: OrdersServiceService,
    private auth: AngularFireAuth,
    public dialog: MatDialog,
    private firestore: AngularFirestore) { }

  async ngOnInit() {
    this.orderSub = this.orderService.getOrders(localStorage.getItem('userId')).subscribe((results) => {
      this.orderList = results;
      if (this.orderList.length == 0)
        this.noOrders = true;
    })
  }

  // function to open the dialog box for new order.
  openOrderDialog() {
    let userId = localStorage.getItem('userId');
    console.log(userId)
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      disableClose: true,
      panelClass: 'order-dialog',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      } else if (result.event == 'Yes') {
        console.log('main data ', result)
        let data: any = result;
        let order = {};

        let id = this.orderService.uuidv4();
        const currentTimestamp = firebase.firestore.FieldValue.serverTimestamp();

        order['id'] = id;
        order['createdBy'] = userId;
        order['createdOn'] = currentTimestamp;
        order['productName'] = data.productName;
        order['orderDueDate'] = data.orderDueDate;
        order['customerName'] = data.customerName;
        order['customerPhone'] = data.customerPhone;
        order['customerAddress'] = data.customerAddress;
        order['amount'] = data.amount;
        order['status'] = 'Placed'

        // calling the order service to st the order
        this.orderService.setOrder(order);
      }
    });
  }

  //function to open dialog box for editing an order
  openOrderEditDialog(orderData:any){
    let userId = localStorage.getItem('userId');
    console.log(userId)
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      disableClose: true,
      panelClass: 'order-dialog',
      data: orderData
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      } else if (result.event == 'Yes') {
        let data: any = result;
        let order = {};

        const currentTimestamp = firebase.firestore.FieldValue.serverTimestamp();

        order['id'] = orderData.id;
        order['createdBy'] = userId;
        order['updatedOn'] = currentTimestamp;
        order['productName'] = data.productName;
        order['createdOn'] = orderData.createdOn;
        order['orderDueDate'] = data.orderDueDate;
        order['customerName'] = data.customerName;
        order['customerPhone'] = data.customerPhone;
        order['customerAddress'] = data.customerAddress;
        order['amount'] = data.amount;
        order['status'] = 'Edited'

        // calling the order service to st the order
        this.orderService.setOrder(order);
      }
    });
  }

  // function to delete an order
  deleteOrder(id){
    const dialogRef = this.dialog.open(deleteOrderConfirmationDialog, {
      disableClose: true,
      panelClass: 'order-dialog',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      } else if (result.event == 'Yes') {
        // calling order service to delete the order
        this.orderService.deleteOrder(id)
      }
    });

  }

  ngOnDestroy(){
    if (this.orderSub) this.orderSub.unsubscribe();
  }

}


// delete order confirmation dialog

@Component({
  selector: 'delete-order-confirmation-dialog',
  template: `
  <div class="confirmationCard">

    <div style="margin-top: 30px;">
        <h2 style="text-align: center; font-weight: bold;">Do you really want to delete this order?</h2>
    </div>

    <div style="display:flex; justify-content: flex-end; margin-top: 55px;">
    <button class="right actionButtons" mat-button color="warn" (click)="close()">Back</button>
    <button class="right actionButtons" mat-button color="warn" (click)="delete()">Delete</button>
    </div>
</div>
  `,
  styleUrls: ['./dashboard.component.css']
})

export class deleteOrderConfirmationDialog implements OnInit {

  constructor(private dialogRef: MatDialogRef<deleteOrderConfirmationDialog>) { }

  ngOnInit() { }

  delete(){
    this.dialogRef.close({ 
      event: "Yes", 
    })
  }

  // function to close dialog box
  close(){
    this.dialogRef.close();
  }

  ngOnDestroy() { }
}
