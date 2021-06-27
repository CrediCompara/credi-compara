import { Component, ViewChild, ViewChildren, Input, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';

@Component({
  selector: 'app-calendario-pagos',
  templateUrl: './calendario-pagos.component.html',
  styleUrls: ['./calendario-pagos.component.css']
})
export class CalendarioPagosComponent implements AfterViewInit {

  @Input() selected_tab_data: any[][]=[];

  dataSource = new MatTableDataSource(this.selected_tab_data)

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.selected_tab_data)
    this.dataSource.paginator = this.paginator;
  }

}
