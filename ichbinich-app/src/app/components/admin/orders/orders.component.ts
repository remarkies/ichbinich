import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data.service';
import {PaintingModel} from '../../../models/painting.model';
import {Subscription} from 'rxjs';
import {EmployeeOrderModel} from '../../../models/employeeOrder.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public paintings: PaintingModel[] = [];
  private paintingsSubscription: Subscription;

  public orders: EmployeeOrderModel[] = [];
  private ordersSubscription: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.paintingsSubscription = this.dataService.paintings$.subscribe(paintings => {
      this.paintings = paintings;
    });

    this.dataService.loadOrders();

    this.ordersSubscription = this.dataService.orders$.subscribe(orders => {
      this.orders = orders;
    });
  }

  markAsSent(order: EmployeeOrderModel): void {
    this.dataService.markOrderAsSent(order);
  }
}
