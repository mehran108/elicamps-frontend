import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  Inject,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { MatDrawer } from "@angular/material";
import { Title } from "@angular/platform-browser";
import { LocalstorageService } from "src/EliCamps/services/localstorage.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
 public defaultColDef;

  public isMobile = false;
  public panelOpenState: boolean;
  public secondPanelOpenState: boolean;
  public reportPanelOpenState: boolean;
  public title='';
  constructor(
    public router: Router,
    @Inject(DOCUMENT) private document: Document,
    public titleService: Title,
    public storage: LocalstorageService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        var title = this.getTitle(
          router.routerState,
          router.routerState.root
        ).join("-");
        this.title = title;
        titleService.setTitle(title);
      }
    });
  }
  get loading$() {
    return this.storage.loading;
  }
  // collect that title data properties from all child routes
  // there might be a better way but this worked for me
  getTitle(state, parent) {
    var data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
  @HostListener("window:resize", [""])
  onResize() {
    this.checkIfWindowIsMobile(window.innerWidth);
  }
  ngOnInit() {
    this.checkIfWindowIsMobile(window.innerWidth);
  }
  private checkIfWindowIsMobile(width: number) {
    this.isMobile = width < 767;
  }
  toggle(sidenav: MatDrawer) {
    const mainContent = document.getElementById("mainContent");
    if (mainContent) {
      mainContent.className = !sidenav.opened ? "custom-width" : "full-width";
    }
    sidenav.toggle();
  }
  public logout = () => {
    this.document.body.classList.add("white-background");
    localStorage.clear();
    this.router.navigate(["login"]);
  };
}
