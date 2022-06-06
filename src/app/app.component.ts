import { Component, Inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { LocalstorageService } from "src/EliCamps/services/localstorage.service";
import { Keys, LookupEnum } from "src/EliCamps/common/lookup.enums";
import { ListService } from "src/EliCamps/services/list.service";
import { Title } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { interval } from "rxjs";
import { SwUpdate } from "@angular/service-worker";
import { MatDialog } from "@angular/material/dialog";
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
    private swUpdate: SwUpdate,
  ) {
    this.checkForUpdates();
    if (swUpdate.isEnabled) {
      interval(60*60).subscribe(() =>
        swUpdate
          .checkForUpdate()
          .then(() => console.log('checking for updates'))
      );
    }
  }
  public checkForUpdates(): void {
    this.swUpdate.available.subscribe((event) => {
      if (!this.isUpdatedVersion) {
        this.promptUser();
        this.isUpdatedVersion = true;
      }
    });
  }
  private promptUser(): void {
    this.dialog.open(this.confirmTemp, {
      hasBackdrop: true,
      disableClose: true,
    });
  }
  checkVersion() {
    navigator.serviceWorker
      .register('/ngsw-worker.js')
      .then((reg: ServiceWorkerRegistration) => {
        console.log('ngsw-worker:s', reg);
        reg.update();
      });
  }
  async ngOnInit() {
    if (localStorage.getItem(Keys.TOKEN_INFO)) {
      this.document.body.classList.remove("white-background");
    } else {
      this.document.body.classList.add("white-background");
    }
    this.list.getAll(LookupEnum.CONFIG).subscribe((res) => {
      if (res && res.length > 0) {
        const regFee = res.find((el) => el.value === 1035);
        if (regFee) {
          this.storage.set(Keys.REG_FEE, regFee.description);
        }
      }
    });
  }
  reload() {
    this.isUpdatedVersion = false;
    window.location.reload();
  }
}
