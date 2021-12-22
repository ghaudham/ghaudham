import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { NgForm } from '@angular/forms';
import { productModel } from './shared/product.model';
import { Router } from '@angular/router';
declare var M: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  errorMessage = ""

  constructor(public products: ProductService, private route: Router) { }

  ngOnInit(): void {
    this.resetForm();
    this.refreshProductList();
  }

  onEdit(pro) {
    this.products.selectedProduct = pro;
    this.errorMessage = "Name can't be changed!!!"
  }
  
  onSubmit(form: NgForm) {

    if (form.value._id == "") {
      this.products.postProduct(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshProductList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      },
        (err) => {
          console.log(err.error)
          this.errorMessage = err.error
          setInterval(() => { this.removeError() }, 5000)
        }
      )
    }
    else if (form.value._id == null) {
      this.products.postProduct(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshProductList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      },
        (err) => {
          console.log(err.error)
          this.errorMessage = err.error
          setInterval(() => { this.removeError() }, 5000)
        }
      )
    }
    else {

      this.products.putProduct(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshProductList();
        this.errorMessage = ""
        console.log(res)
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      },

        (err) => {
          console.log(err.error + "upadte")
          this.errorMessage = err.error
          setInterval(() => { this.removeError() }, 5000)
        }
      )
    }
  }
  removeError() {
    this.errorMessage = ""
  }


  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.products.selectedProduct = {
      _id: "",
      name: "",
      price: null,
      quantity: null,
      description: ""

    }
  }
  refreshProductList() {
    this.products.getProductList().subscribe((res) => {
      this.products.product = res as productModel[];
    });
  }


 

  onDelete(_id: string, form: NgForm) {

    if (confirm('Are you sure to delete this record ?') == true) {
      this.products.deleteProduct(_id).subscribe((res) => {
        this.refreshProductList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }

  logout() {
    localStorage.removeItem('vendorToken')
    this.route.navigate(['login'])
  }

}
