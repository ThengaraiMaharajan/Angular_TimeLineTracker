import { Component,ElementRef,Input,OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , Validator} from '@angular/forms';
import { ExportToExcelService } from './services/export-to-excel.service';
import * as XLSX from 'xlsx';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  data : any;
  chartOptions!: Highcharts.Options;

  @ViewChild('mychart') mychart : any;
  title = 'timeLineTracker';
  myForm!: FormGroup;
  formValues : any;
  jsonData : any;
  canvas: any;
  ctx: any;

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
    this.data = [1,2,3,4]
    this.chartOptions={
      chart: {
          type: 'bar'
      },
      title: {
          text: 'Historic World Population by Region',
          align: 'left'
      },
      subtitle: {
          text: 'Source: <a ' +
              'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
              'target="_blank">Wikipedia.org</a>',
          align: 'left'
      },
      xAxis: {
          categories: ['Africa', 'America', 'Asia', 'Europe'],
          title: {
              text: null
          },
          gridLineWidth: 1,
          lineWidth: 0
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Population (millions)',
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          },
          gridLineWidth: 0
      },
      tooltip: {
          valueSuffix: ' millions'
      },
      plotOptions: {
          bar: {
              borderRadius: '50%',
              dataLabels: {
                  enabled: true
              },
              groupPadding: 0.1
          }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor:'#FFFFFF',
          shadow: true
      },
      credits: {
          enabled: false
      }
  
  
  
  
  
  }
}

}
