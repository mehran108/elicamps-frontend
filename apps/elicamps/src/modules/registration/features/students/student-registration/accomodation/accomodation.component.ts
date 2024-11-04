/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Campus, Student } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { SharedService } from 'apps/elicamps/src/services/shared.service';
@Component({
  selector: 'app-accomodation',
  templateUrl: './accomodation.component.html',
  styleUrls: ['./accomodation.component.css']
})
export class AccomodationComponent {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() studentRegistration: EventEmitter<any> = new EventEmitter<any>();

  public accomodationForm!: FormGroup;
  public showHomeStay = false;
  public showRooms = false;

  @Input() isEdit = false;
  public homeStayOrResidenceList: any;
  public studentId!: number;
  @Input() campusList!: Campus[];
  @Input() student!: Student;
  @Input() homeStayList: any;
  @Input() roomList: any;
  @Input() studentForm!: FormGroup;
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
  gethoomeStaylist = ($event: any) => {
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
    if (this.homeStayList.find((res: any) => res.homeId == value)) {
      const home = this.homeStayList.find((res: any) => res['homeId'] === value)
      return home ?  home['homeStayLocationURL']:  '';
    }
    return '';
  }
}
