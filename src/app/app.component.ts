import { Component, Inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { interval } from "rxjs";
import { SwUpdate } from "@angular/service-worker";
import { MatDialog } from "@angular/material/dialog";
import { ListService } from "src/services/list.service";
import { LocalstorageService } from "src/services/localstorage.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {

  title = "elicamps";
  @ViewChild('confirmTemp') confirmTemp: TemplateRef<any>;

  public isUpdatedVersion = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public storage: LocalstorageService,
    public list: ListService,
    public dialog: MatDialog,
  ) {}
  ngOnInit(): void {

  }
}
