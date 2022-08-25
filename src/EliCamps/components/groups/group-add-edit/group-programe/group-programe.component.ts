import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListService } from '../../../../services/list.service';
import { LookupTable, ProgrameAddins, SubProgram, Program, Campus, Group } from '../../../../EliCamps-Models/Elicamps';
import { GroupService } from '../../../../services/group.service';
import { LookupEnum } from '../../../../common/lookup.enums';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
  selector: 'app-group-programe',
  templateUrl: './group-programe.component.html',
  styleUrls: ['./group-programe.component.css']
})
export class GroupProgrameComponent implements OnInit {
 public defaultColDef;

  public programeFrom: FormGroup;
  public submitted = false;
  public campusList: Campus[] = [];
  public formatList: LookupTable[] = [];
  public mealPlanList: LookupTable[] = [];
  public chapProgramList: LookupTable[] = [];
  public programeAddinsList: ProgrameAddins[] = [];
  public programList: Program[] = [];
  public subProgramList: SubProgram[] = [];
  public selectedGroup: any;
  private gridApi: any;
  public groupId: any;
  public isEdit: any;
  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
    public groupService: GroupService,
    public route: ActivatedRoute,
    public location: Location,
    public toastr: ToastrService) { }

  ngOnInit() {
    this.initializeForm();
    this.getDropdownLists();
    this.getParams();
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.groupId) {
        this.groupId = Number(atob(params.groupId));
        if (this.groupId) {
          this.isEdit = true;
          this.getSelectedGroup(this.groupId);
        }
      }
    });
  }
  public getSelectedGroup = (groupId: number) => {
    this.groupService.getElicampsGroup(groupId).subscribe((group: Group) => {
      if (group) {
        this.selectedGroup = group;
        this.initializeFormWithValues(group);
      }
    }, error => {
    });
  }
  initializeForm() {
    this.programeFrom = this.formBuilder.group({
      programeStartDate: [],
      programeEndDate: [],
      campus: [],
      format: [1020],
      mealPlan: ['Full Board'],
      programeAddins: [],
      chapFamily: ['Student'],
      programId: [],
      subProgramId: [],
    });
  }
  initializeFormWithValues(group: Group) {
    this.programeFrom = this.formBuilder.group({
      programeStartDate: [group.programeStartDate],
      programeEndDate: [group.programeEndDate],
      campus: [group.campus],
      format: [group.format || 1020],
      mealPlan: [group.mealPlan || 'Full Board'],
      programeAddins: [group.programeAddins],
      chapFamily: [group.chapFamily || 'Student'],
      programId: [group.programId],
      subProgramId: [group.subProgramId],
    });
    this.setDefaultAddins();
    this.setDefaultProgram();
  }
  public getDropdownLists = () => {
    const paramsAddin = {
      active: true
    };
    this.listService.getAllCampus(paramsAddin).subscribe(res => {
      this.campusList = res.data;
    });
    this.listService.getAll(LookupEnum.FORMAT).subscribe(res => {
      this.formatList = res;
    });
    this.listService.getAll(LookupEnum.MEALPLAN).subscribe(res => {
      this.mealPlanList = res;
    });
    this.listService.getAll(LookupEnum.CHAPPROGRAM).subscribe(res => {
      this.chapProgramList = res;
    });
    this.listService.getAllAddins(paramsAddin).subscribe(res => {
      this.programeAddinsList = res.data;
      this.setDefaultAddins();
    });
    const params = {
      active: true
    };
    this.listService.getAllProgram(params).subscribe(res => {
      this.programList = res.data;
      this.setDefaultProgram();
    });
  }
  public setDefaultProgram = () => {
    const defaultProgram = this.programList.find(program => program.isDefault);
    if (this.programeFrom.controls.programId.value) {
      this.programeFrom.controls.programId.setValue(this.programeFrom.controls.programId.value);
    } else {
      this.programeFrom.controls.programId.setValue(defaultProgram.id);
    }
  }
  setDefaultAddins = () => {
    const defaultAddins = this.programeAddinsList.filter((addin: any) => addin.isDefault).map((add: any) => add.id);
    if (this.programeFrom.controls.programeAddins.value && this.programeFrom.controls.programeAddins.value.length > 0) {
      this.programeFrom.controls.programeAddins.setValue(this.programeFrom.controls.programeAddins.value);
    } else {
      this.programeFrom.controls.programeAddins.setValue(defaultAddins);
    }
  }
  public getSubProgram = (program) => {
    this.listService.getSubProgramByProgramId(program.value).subscribe(res => {
      this.subProgramList = res.data;
    });
  }
  onSubmit = () => {
    this.submitted = true;
    if (this.programeFrom.valid) {
      const model = {
        ...this.selectedGroup,
        ...this.programeFrom.value
      };
      // tslint:disable-next-line: max-line-length
      const programeStartDate = this.programeFrom.controls.programeStartDate.value ? moment(this.programeFrom.controls.programeStartDate.value).format('MM/DD/YYYY') : '';
      // tslint:disable-next-line: max-line-length
      const programeEndDate = this.programeFrom.controls.programeEndDate.value ? moment(this.programeFrom.controls.programeEndDate.value).format('MM/DD/YYYY') : '';
      model.programeStartDate = programeStartDate;
      model.programeEndDate = programeEndDate;
      this.groupService.updateGroupProgram(model).subscribe(res => {
        if (res) {
          this.toastr.success('Success', 'Group Program Updated Successfully');
        }
      });
    }
  }
}
