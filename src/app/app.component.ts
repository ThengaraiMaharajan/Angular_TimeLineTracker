import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , Validator} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'timeLineTracker';
  myForm!: FormGroup;
  formValues : any;

  constructor(private fb : FormBuilder){}
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
  }

}
