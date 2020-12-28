import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../services/order.service';
import {PaintingModel} from '../../../models/painting.model';
import {Subscription} from 'rxjs';
import {EmployeeOrderModel} from '../../../models/employeeOrder.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public order: EmployeeOrderModel;
  private orderSubscription: Subscription;

  constructor(private route: ActivatedRoute, private orderService: OrderService, private router: Router) {
    this.route.params.subscribe( params => {
      this.orderService.loadOrder(params.id);
    });
  }

  ngOnInit(): void {
    this.orderSubscription = this.orderService.order$.subscribe(order => {
      this.order = order;
    });
  }


  back(): void {
    this.router.navigate(['/user/']);
  }

}
