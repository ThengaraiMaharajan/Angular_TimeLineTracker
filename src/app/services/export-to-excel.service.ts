import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportToExcelService {

  constructor() { }

  exportToExcel(data: any[], filename: string) {
    const formattedData = this.formatData(data);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, filename);
  }

  private formatData(data: any[]): any[] {
    const formattedData : any= [];
    data.forEach(item => {
      item.events.forEach((event : any) => {
        const rowData = {
          name: item.name,
          dob: this.formatDate(item.dob),
          eventName: event.eventName,
          eventDescription: event.eventDescription,
          eventDate: this.formatDate(event.eventDate),
          eventDateRaw : event.eventDate
        };
        formattedData.push(rowData);
      });
    });
    return formattedData;
  }

  private formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options).toUpperCase();
    return formattedDate;
  }

  private saveExcelFile(buffer: any, filename: string) {
    const data: Blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = `${filename}.xlsx`;
    a.click();
  }

}
