import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/EliCamps/services/shared.service';
import { ListService } from 'src/EliCamps/services/list.service';
import { Student } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  @Input() student: Student;
  public Editor = ClassicEditor;
  @Input() isEdit = false;
  public registerForm: FormGroup;
  public submitted = false;
  public loading = false;
  public id: number;
  @Input() studentForm: FormGroup;
  constructor(
    public shared: SharedService,
    public listService: ListService,
    public spinner: NgxSpinnerService,
    public location: Location) { }
  ngOnInit() {
  }
}
