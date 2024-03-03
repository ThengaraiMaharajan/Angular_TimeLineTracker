import { Component,OnInit } from '@angular/core';
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
      eventDate: ['']
    });
    this.events.push(eventGroup);
  }

  removeEvent(index: number) {
    this.events.removeAt(index);
  }

  onSubmit() {
    this.formValues = this.myForm.value;
    console.log('Form Values:', this.myForm.value);
    this.exportTotExcel.exportToExcel([this.formValues], 'form_data');
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
  }

  uploadFile() {
    console.log(this.jsonData);
    // Here, you can further process the JSON data as needed, such as displaying it in HTML
  }

}
