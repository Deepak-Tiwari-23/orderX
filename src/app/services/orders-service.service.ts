import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersServiceService {

  constructor(private firestore: AngularFirestore,
              private toastr: ToastrService) { }

  // function to generate random ids
  uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

  // function to get all the orders of the user
  getOrders(id): Observable<any>{
    let orderRef = this.firestore.collection('orders', ref => ref.where('createdBy', '==', id));
    return orderRef.valueChanges();
  }

  // function for deleting an order
  deleteOrder(id){
    this.firestore.collection('orders').doc(id).delete().then(()=>{
      let message = "You have successfully deleted your order."
      this.toastr.success(message, "Done")
    }).catch((err)=>{
      console.log('error ', err)
    })
  }

  // function to set an order
  setOrder(order:any){
    this.firestore.collection('orders').doc(order.id).set(order).then(()=>{
      let message = "You have successfully made your order."
      this.toastr.success(message, "Done")
    }).catch((err)=>{
      console.log('error ', err)
    })
  }
  
}
