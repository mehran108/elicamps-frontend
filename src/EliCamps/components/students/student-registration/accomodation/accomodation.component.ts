import { ListService } from 'src/EliCamps/services/list.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Campus, Student } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { SharedService } from 'src/EliCamps/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
@Component({
  selector: 'app-accomodation',
  templateUrl: './accomodation.component.html',
  styleUrls: ['./accomodation.component.css']
})
export class AccomodationComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onStudentRegistration: EventEmitter<any> = new EventEmitter<any>();

  public accomodationForm: FormGroup;
  public showHomeStay = false;
  public showRooms = false;

  @Input() isEdit = false;
  public homeStayOrResidenceList: any = [];
  public studentId: number;
  @Input() campusList: Campus[];
  @Input() student: Student;
  @Input() homeStayList = [];
  @Input() roomList: any = [];
  @Input() studentForm: FormGroup;
   public defaultColDef;
  constructor(
    public listService: ListService,
    public shared: SharedService,
    public taostr: ToastrService,
    public location: Location
  ) {
    this.homeStayOrResidenceList = [
      { value: "1", name: 'HomeStay' },
      { value: "2", name: 'Residence' },
      { value: "3", name: 'No Accommodation' }
    ];
   }
  ngOnInit() {
  }

  ngOnChanges(change: SimpleChanges) {
  }

  gethoomeStaylist = ($event) => {
    if ($event.value == "1") {
      this.showHomeStay = true;
      this.showRooms = false;
    } else if ($event.value == "2") {
      this.showRooms = true;
      this.showHomeStay = false;
    } else if ($event.value == "3") {
      this.showRooms = false;
      this.showHomeStay = false;
    }
  }

  public getHTML = (value: number) => {
    if (this.homeStayList.find(res => res.homeId == value)) {
      return this.homeStayList.find(res => res.homeId === value).homeStayLocationURL || '';
    }
  }
}
