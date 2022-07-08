import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SpringbootservicesService } from 'src/app/springbootservices.service';
import { Product } from 'src/app/_models/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  categoryList : any;
  form: Product ={
    title: '',
    price: 0,
    imageurl: '',
    productid: '',
    category: '',
    quantity:0
  };
    isSaveFailed = false;
    errorMessage = '';
    isSuccessful = false;
    succesMessage='';
    isTitleNonEditable= false;
  constructor(private backendServices : SpringbootservicesService,private routes:Router,private route:ActivatedRoute) {

    let productid=this.route.snapshot.paramMap.get('productid');
    if(productid){
      this.isTitleNonEditable=true;
      backendServices.getproductwithid(productid).subscribe(
        data => {
          console.log(data);
          this.form=data;
        },
        err => {
          console.log(err);
          this.errorMessage = err.error.message;
        }
      );
      }
    backendServices.getCategoryList().subscribe(
      data => {
        console.log(data);
        this.categoryList=data;
      },
      err => {
        console.log(err);
        this.errorMessage = err.error.message;
      }
    );


  }

  ngOnInit(): void {
    this.backendServices.navbarcollapse.next(false);
  }

  onSubmit() {
   // console.log(this.form)

    this.backendServices.savenewproduct(this.form).subscribe(
      data => {
        if (data) {
          console.log(data);
        this.isSuccessful = true;
        this.succesMessage = data.message;
        this.routerNavigate();
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSaveFailed = true;
      }
    );
  }

  delete(){
    if(!confirm("Are you sure you want to delete this product?")) return;{
      this.backendServices.deleteproduct(this.form).subscribe(
        data => {
          if (data) {
            console.log(data);
          this.isSuccessful = true;
          this.succesMessage = data.message;
          this.routerNavigate();
          }
        },
        err => {
          this.errorMessage = err.error.message;
          this.isSaveFailed = true;
        }
      );
      this.routerNavigate();
    }
  }

  routerNavigate() {
    setTimeout(() =>
   {
    this.routes.navigateByUrl('/admin/products')
     .then(()=>{
      window.location.reload();
     });
    },
    2000);
  }

}
