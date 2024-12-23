import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/Employee';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add CommonModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'CRUD_Angular18'; // Title of the app

  employeeForm: FormGroup = new FormGroup({}); // FormGroup to manage the employee form controls
  employeeObj: EmployeeModel = new EmployeeModel(); // Object to hold the employee data
  employeeList: EmployeeModel[] = []; // Array to store the list of employees

  constructor() {
    this.createForm(); // Initialize the form when the component is created
    const oldData = localStorage.getItem("EmpData"); // Fetching old data from localStorage
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData; // Populating the employee list with stored data
    }
  }

  // Method to reset the form and the employee object
  reset() {
    this.employeeObj = new EmployeeModel(); 
    this.createForm();
  }

  // Method to create and initialize the form with default values
  createForm() { 
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId), 
      name: new FormControl(this.employeeObj.name, [Validators.required]), 
      emailId: new FormControl(this.employeeObj.emailId, [Validators.required]),
      contactNo: new FormControl(this.employeeObj.contactNo, [Validators.required]),
      address: new FormControl(this.employeeObj.address, [Validators.required]),
      gender: new FormControl(this.employeeObj.gender, [Validators.required]),  // Gender field

    });  
  }
  
  // Method to save 
  onSave() {
    const oldData = localStorage.getItem("EmpData");
    if (oldData != null) { 
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1); // Assigning a new ID
      this.employeeList.unshift(this.employeeForm.value); // Adding the new employee to the top of the list
    } else {
      this.employeeForm.controls['empId'].setValue(1); // Start with ID 1 if no data exists
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList)); // Save the updated list to localStorage
    this.reset(); // Reset the form after saving
  }

  // Method to edit 
  onEdit(item: EmployeeModel) {
    this.employeeObj = item; // Set the selected employee data in the form
    this.createForm(); // Recreate the form with the selected employee's data
  }

  // Method to update 
  onUpdate() {
    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empId'].value);
    if (record != undefined) {
      // Update the record with the form values
      record.name = this.employeeForm.controls['name'].value;
      record.emailId = this.employeeForm.controls['emailId'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
      record.address = this.employeeForm.controls['address'].value;
      record.gender = this.employeeForm.controls['gender'].value;  // Update gender

    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList)); // Save the updated list to localStorage
    this.reset(); // Reset the form after updating
  }

  // Method to delete 
  onDelete(id: number) {
    const isDelete = confirm("Are you sure you want to delete ?"); // Confirm before deletion
    if (isDelete) {
      const index = this.employeeList.findIndex(m => m.empId == id); // Find the employee by ID
      this.employeeList.splice(index, 1); // Remove the employee from the list
      localStorage.setItem("EmpData", JSON.stringify(this.employeeList)); // Save the updated list to localStorage
    }
  }
}
