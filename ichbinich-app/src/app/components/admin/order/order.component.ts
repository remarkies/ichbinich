import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../services/order.service';
import {Subscription} from 'rxjs';
import {EmployeeOrderModel} from '../../../models/employeeOrder.model';
import {PaintingModel} from '../../../models/painting.model';
import {ImageService} from '../../../services/image.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public order: EmployeeOrderModel;
  private orderSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private orderService: OrderService,
              private router: Router,
              private imageService: ImageService) {
    this.route.params.subscribe( params => {
      this.orderService.loadOrder(params.id);
    });
  }

  ngOnInit(): void {
    this.orderSubscription = this.orderService.order$.subscribe(order => {
      this.order = order;
    });
  }

  public getImage(path: string): string {
      return this.imageService.getImageWithPath(path);
  }

  back(): void {
    this.router.navigate(['/user/']);
  }

}
