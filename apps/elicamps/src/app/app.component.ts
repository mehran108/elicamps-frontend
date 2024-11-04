import { Component, Inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { Keys, LookupEnum } from "../common/lookup.enums";
import { ListService } from "../services/list.service";
import { LocalstorageService } from "../services/localstorage.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {

  title = "elicamps";
  @ViewChild('confirmTemp') confirmTemp!: TemplateRef<any>;

  public isUpdatedVersion = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public storage: LocalstorageService,
    public list: ListService,
    public dialog: MatDialog
  ) {
  }
  async ngOnInit() {
    if (localStorage.getItem(Keys.TOKEN_INFO)) {
      this.document.body.classList.remove("white-background");
    } else {
      this.document.body.classList.add("white-background");
    }
    this.list.getAll(LookupEnum.CONFIG).subscribe((res) => {
      if (res && res.length > 0) {
        const regFee = res.find((el: any) => el.value === 1035);
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
