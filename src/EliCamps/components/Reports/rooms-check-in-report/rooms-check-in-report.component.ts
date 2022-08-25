import { Component, OnInit } from "@angular/core";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { Router } from "@angular/router";
import { ChipRendererComponent } from "src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component";
import {
  Student,
  Campus,
  Room,
  ProgrameAddins,
  HomeStay,
  Program,
} from "src/EliCamps/EliCamps-Models/Elicamps";
import { GroupService } from "src/EliCamps/services/group.service";
import { ListService } from "src/EliCamps/services/list.service";
import { throwError } from "rxjs";
import * as moment from "moment";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { downloadPDF, generatePDF } from "src/EliCamps/common/lookup.enums";

@Component({
  selector: "app-rooms-check-in-report",
  templateUrl: "./rooms-check-in-report.component.html",
  styleUrls: ["./rooms-check-in-report.component.css"],
})
export class RoomsCheckInReportComponent implements OnInit {
  public gridOptions: any;
  public info: string;
  public studentList;
  public startDate;
  public endDate;
  public campus: Campus;
  public campusList: Campus[];
  public rooms: Room[];
  public sort;
  public sortList = [
    { text: "Check In Date", value: "roomSearchFrom" },
    { text: "Student", value: "name" },
    { text: "Room Number", value: "roomID" },
  ];
  constructor(
    public listService: ListService,
    public groupService: GroupService
  ) {}
  ngOnInit() {
    this.getCampusList();
    this.getRooms();
  }
  public getRooms() {
    const params = {
      active: true,
    };
    this.listService.getAllRoomList().subscribe((res) => {
      this.rooms = res.data;
    });
  }
  public getCampusList = async () => {
    const params = {
      active: true,
    };
    const campuseResponse = await this.listService
      .getAllCampus(params)
      .toPromise()
      .catch((error) => throwError(error));
    if (campuseResponse) {
      this.campusList = campuseResponse.data;
    }
    this.getReportList();
  };
  public getReportList = () => {
    this.groupService
      .getAllElicampsStudents({ active: true })
      .subscribe((res: Array<any>) => {
        this.studentList = (res as any).data.filter(row => row.statusId !== 1030 && row.statusId !== 1036 && row.active);;
        this.createUIList();
      });
  };
  public createUIList() {
    this.studentList = this.studentList.map((student) => {
      const room = this.rooms.find((r) => r.id == student.roomID);
      return {
        ...student,
        name: `${student.firstName} ${student.lastName}`,
        ...room,
      };
    });
  }

  filterChage = () => {
    if (
      this.studentList.length > 0 &&
      this.startDate &&
      this.endDate &&
      this.sort &&
      this.campus
    ) {
      const sortKey = this.sort.value;
      let list = this.studentList.filter((student) => {
        return (

          this.startDate <= new Date(student.roomSearchFrom) &&
          new Date(student.roomSearchFrom) <= this.endDate
        );
      });
      list = list.filter((el) => el.campusName === this.campus.campus);
      let groups = list.map((row) => row.agencyRef);
      let updatedList = [];
      groups = new Set(groups);
      groups.forEach((group) => {
        let groupedList = list.filter(
          (el) => el.agencyRef && el.agencyRef === group
        );
        groupedList = groupedList.sort(
          (a, b) =>
            a[sortKey] &&
            b[sortKey] &&
            a[sortKey].localeCompare(b[sortKey], "en", { numeric: true })
        );
        if (groupedList.length > 0) {
          updatedList.push(
            {
              roomID: group,
              roomType: "",
              firstName: "",
              lastName: "",
              agencyRef: "",
              arrivalDate: "",
              departureDate: "",
              numberOfNights: "",
              isGroup: true,
            },
            ...groupedList
          );
        }
      });
      let withouGroupList = list.filter((row) => !row.agencyRef);
      withouGroupList = withouGroupList.sort(
        (a, b) =>
          a[sortKey] &&
          b[sortKey] &&
          a[sortKey].localeCompare(b[sortKey], "en", { numeric: true })
      );
      updatedList = [...withouGroupList, ...updatedList];
      updatedList = updatedList.map((row) => {
        var a = moment(this.endDate);
        var b = moment(this.startDate);

        return {
          ...row,
          numberOfNights: a.diff(b, "days"),
        };
      });
      generatePDF(
        "download",
        updatedList,
        this.startDate,
        this.endDate,
        this.sort.text,
        this.campus.campus
      );
      return;
    }
  };
  public clear() {
    this.sort = null;
    this.campus = null;
    this.startDate = null;
    this.endDate = null;
  }
}
