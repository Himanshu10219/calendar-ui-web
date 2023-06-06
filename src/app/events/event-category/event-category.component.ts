import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventCategoryModel } from '@model/eventcategory.model';
import { eventCategoryApiService } from '@service/eventcategory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-category',
  templateUrl: './event-category.component.html',
  styleUrls: ['./event-category.component.css'],
})
export class EventCategoryComponent {
  categoryList: EventCategoryModel[] = [];
  searchText: string = '';
  categoryName: string = '';
  editCategoryName: string = '';
  isEdit: boolean = true;
  currentEditID: number = 0;
  constructor(
    private categoryAPI: eventCategoryApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllCategories();
  }
  async getAllCategories() {
    const allCategories = await this.categoryAPI.geteventCategoryAPI({});
    if (allCategories != null) {
      this.categoryList = allCategories.data;
    }
  }

  async deleteCategory(id: any, name: string) {
    Swal.fire({
      title: 'Are you sure you want to remove ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const categoryDeleteResult = await this.categoryAPI.deleteCategory(id);
        console.log(categoryDeleteResult);
        if (categoryDeleteResult?.status) {
          Swal.fire({
            icon: 'success',
            title: name + '  has been removed !',
            showConfirmButton: true,
            confirmButtonText: 'OK',
          });
          this.getAllCategories();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops.....',
            text: 'Something went wrong!',
            showConfirmButton: true,
            confirmButtonText: 'OK',
          });
        }
      }
    });
  }

  addModal(value: string) {
    this.editCategoryName = value;
    this.isEdit = value != '';
    const modal = document.getElementById('exampleModal');
    if (modal != null) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeAddModal() {
    const modal = document.getElementById('exampleModal');
    if (modal != null) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
  async editCategory(id: number, name: string) {
    this.currentEditID = id;
    this.addModal(name);
  }

  async addCategory() {
    let curDate = new Date().toISOString().slice(0, 10).toString();
    const eventCategory: EventCategoryModel = {
      name: this.categoryName,
      createdAt: curDate,
    };
    let categoryAPIResponse: any;
    if (!this.isEdit) {
      categoryAPIResponse = await this.categoryAPI.addEventCategoryAPI(
        eventCategory
      );
    } else {
      categoryAPIResponse = await this.categoryAPI.updateEventCategoryAPI(
        eventCategory,
        this.currentEditID
      );
    }

    if (categoryAPIResponse?.status) {
      Swal.fire({
        icon: 'success',
        title: 'Your Category has been added !',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          const modal = document.getElementById('exampleModal');
          if (modal != null) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
          this.getAllCategories();
        }
      });
    }
  }
}
