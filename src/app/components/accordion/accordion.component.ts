import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, Input, Output, EventEmitter, SimpleChanges, AfterViewInit, OnChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccordionComponent implements OnInit, AfterViewInit, OnChanges {

  public isPanelCollapsed: boolean = false;
  private panelContent: any;
  private contentHeight: number = 0;

  constructor(private element: ElementRef) { }

  @Input()
  icon: string = '';
  @Input()
  title: string = '';
  @Input()
  startsCollapsed: boolean = false;
  @Input()
  isBackgroundWarning: boolean = false;
  @Input()
  isUsingFilter = false;
  @Input()
  isUsingCssTitle = false;
  @Input()
  isApplyFilter = false;

  @Output()
  OpenEvent = new EventEmitter<boolean>();

  @Output()
  openFilter = new EventEmitter();

  ngOnInit() {
    this.isPanelCollapsed = this.startsCollapsed;
  }

  ngAfterViewInit() {
    this.isPanelCollapsed = this.startsCollapsed;
    this.panelContent = this.element.nativeElement.querySelector(
      '.accordion-content'
    );
    this.contentHeight = this.panelContent.scrollHeight;
    this.expandCollapse();
  }

  ngOnChanges(changes: SimpleChanges) {
    const prev = changes['startsCollapsed']?.previousValue;
    const current = changes['startsCollapsed']?.currentValue;

    if (prev === false && current === true) {
      this.collapse();
      this.isPanelCollapsed = true;
    }

    if (prev === true && current === false) {
      this.expand();
      this.isPanelCollapsed = false;
    }
  }

  togglePanelCollapse() {
    this.isPanelCollapsed = !this.isPanelCollapsed;
    this.expandCollapse();
  }

  expandCollapse() {
    if (this.isPanelCollapsed) {
      this.collapse();
    } else {
      this.expand();
      this.OpenEvent.emit(true);
    }
  }

  collapse() {
    this.panelContent.style.height = 0 + 'px';
  }
  expand() {
    this.panelContent.style.height = 'auto';
  }

  filter() {
    this.openFilter.emit();
  }

}
