import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SimplebarAngularModule } from "simplebar-angular";

@Component({
  selector: "app-filter-menu",
  templateUrl: "./filter-menu.component.html",
  styleUrls: ["./filter-menu.component.scss"],
  imports: [CommonModule, SimplebarAngularModule]
})
export class FilterMenuComponent implements OnInit {
  public isMenuActive = false;
  @Output()
  closeBackgroundFilter = new EventEmitter<any>();

  constructor() {}
  ngOnInit() {}

  showMenu(active: boolean) {
    this.isMenuActive = active;
  }

  closeFilter() {
    this.closeBackgroundFilter.emit();
    this.showMenu(false);
  }
}
