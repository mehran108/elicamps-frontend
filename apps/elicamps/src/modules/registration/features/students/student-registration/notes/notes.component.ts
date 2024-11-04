/* eslint-disable @nx/enforce-module-boundaries */
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { SharedService } from 'apps/elicamps/src/services/shared.service';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {

  @Input() student: any;
  // public Editor = ClassicEditor;
  @Input() isEdit: any = false;
  public registerForm!: FormGroup;
  public submitted = false;
  public loading = false;
  public id!: number;
  @Input() studentForm!: FormGroup;
  constructor(
    public shared: SharedService,
    public listService: ListService,
    public spinner: NgxSpinnerService,
    public location: Location) { }
}
