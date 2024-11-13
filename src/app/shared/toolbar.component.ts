import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { LayoutService } from '../core/service/layout.service';

@Component({
  selector: 'app-toolbar',
  moduleId: module.id,
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.scss']
})
export class ToolbarComponent {

  @Input() loading = false;
  @Input() title = '';
  @Input() titleCentered = true;

  constructor(private layout: LayoutService) { }

}
