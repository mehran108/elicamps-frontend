/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from "@angular/core";
import { generatePDF } from "apps/elicamps/src/common/lookup.enums";
import { GroupService } from "apps/elicamps/src/services/group.service";
import { ListService } from "apps/elicamps/src/services/list.service";
import moment from "moment";
import { throwError } from "rxjs";

@Component({
  selector: "app-rooms-check-in-report",
  templateUrl: "./rooms-check-in-report.component.html",
  styleUrls: ["./rooms-check-in-report.component.css"],
})
export class RoomsCheckInReportComponent implements OnInit {
  public gridOptions: any;
  public info: any;
  public studentList: any;
  public startDate: any;
  public endDate: any;
  public campus: any;
  public campusList: any;
  public rooms: any;
  public sort: any;
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
      .subscribe((res: any) => {
        this.studentList = (res as any).data.filter((row: any) => row.statusId !== 1030 && row.statusId !== 1036 && row.active);;
        this.createUIList();
      });
  };
  public createUIList() {
    this.studentList = this.studentList.map((student: any) => {
      const room = this.rooms.find((r: any) => r.id == student.roomID);
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
      let list = this.studentList.filter((student: any) => {
        return (

          this.startDate <= new Date(student.roomSearchFrom) &&
          new Date(student.roomSearchFrom) <= this.endDate
        );
      });
      list = list.filter((el: any) => el.campusName === this.campus.campus);
      let groups = list.map((row: any) => row.agencyRef);
      let updatedList: any = [];
      groups = new Set(groups);
      groups.forEach((group: any) => {
        let groupedList = list.filter(
          (el: any) => el.agencyRef && el.agencyRef === group
        );
        groupedList = groupedList.sort(
          (a: any, b: any) =>
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
      let withouGroupList = list.filter((row: any) => !row.agencyRef);
      withouGroupList = withouGroupList.sort(
        (a: any, b: any) =>
          a[sortKey] &&
          b[sortKey] &&
          a[sortKey].localeCompare(b[sortKey], "en", { numeric: true })
      );
      updatedList = [...withouGroupList, ...updatedList];
      updatedList = updatedList.map((row: any) => {
        const a = moment(this.endDate);
        const b = moment(this.startDate);

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
