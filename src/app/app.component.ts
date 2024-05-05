import { Component,ElementRef,Input,OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , Validator} from '@angular/forms';
import { ExportToExcelService } from './services/export-to-excel.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  title = 'timeLineTracker';
  myForm!: FormGroup;
  formValues : any;
  jsonData : any;
  canvas: any;
  ctx: any;
  formSubmittedDisplayData : boolean = false;
  showFileDataDisplay : boolean = false;

  constructor(private fb : FormBuilder, private exportTotExcel : ExportToExcelService){}
  ngOnInit(): void {

    this.myForm = this.fb.group({
      name: [''],
      dob: [''],
      events: this.fb.array([])
    });

  }

  get events(): FormArray {
    return this.myForm.get('events') as FormArray;
  }

  addEvent() {
    const eventGroup = this.fb.group({
      eventName: [''],
      eventDescription: [''],
      eventDate: [''],
      isPast:['']
    });
    this.events.push(eventGroup);
  }

  removeEvent(index: number) {
    this.events.removeAt(index);
  }

  onSubmit() {
    this.formValues = this.myForm.value;
    this.formValues.events.forEach((userEvent : any) => {
      userEvent.pastOrFuture = this.isPastOrFuture(userEvent.eventDate);
      userEvent.formatedDate = this.formatDate(userEvent.eventDate);
      userEvent.dayCount = this.calculateDaysDifference(userEvent.eventDate);
    });
    this.exportTotExcel.exportToExcel([this.formValues], 'form_data');
    this.formSubmittedDisplayData = true;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      this.jsonData = XLSX.utils.sheet_to_json(sheet);
    };
    reader.readAsArrayBuffer(file);
    this.showFileDataDisplay = true;
  }

  uploadFile() {
    console.log(this.jsonData);
  }

  formatDate(inputDate : any) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const parts = inputDate.split('-');
    const day = parts[2];
    const month = months[parseInt(parts[1], 10) - 1];
    const year = parts[0];
  
    return `${day}-${month}-${year}`;
  }

  isPastOrFuture(inputDate:any) {
    const currentDate = new Date();
    const providedDate = new Date(inputDate);
  
    if (providedDate < currentDate) {
      return "past";
    } else if (providedDate > currentDate) {
      return "future";
    } else {
      return "present";
    }
  }
  
  calculateDaysDifference(dateString : any) {
    const currentDate = new Date();
    const providedDate = new Date(dateString);
  
    // Calculate the difference in milliseconds
    const differenceInMs = providedDate.getTime() - currentDate.getTime();
  
    // Convert milliseconds to days
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
  
    if (differenceInDays < 0) {
      // return { status: "past", days: Math.abs(differenceInDays) };
      return 'past : '+Math.abs(differenceInDays)+' days ago';
    } else if (differenceInDays > 0) {
      // return { status: "future", days: differenceInDays };
      return 'future : '+differenceInDays+' days to go';
    } else {
      // return { status: "present", days: 0 };
      return 'present';
    }
  }
  
  calculateRelativeDate(durationString : any) {
    const durationParts = durationString.split(" ");
    let currentDate = new Date();
  
    let years = 0;
    let months = 0;
    let days = 0;
  
    for (let i = 0; i < durationParts.length; i += 2) {
      const value = parseInt(durationParts[i]);
      const unit = durationParts[i + 1].toLowerCase();
  
      if (unit === "year" || unit === "years") {
        years += value;
      } else if (unit === "month" || unit === "months") {
        months += value;
      } else if (unit === "day" || unit === "days") {
        days += value;
      }
    }
  
    // Adjust the current date
    currentDate.setFullYear(currentDate.getFullYear() - years);
    currentDate.setMonth(currentDate.getMonth() - months);
    currentDate.setDate(currentDate.getDate() - days);
  
    return currentDate;
  }
  
  
  

}
