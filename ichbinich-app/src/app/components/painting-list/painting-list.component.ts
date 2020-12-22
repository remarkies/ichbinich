import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {PaintingModel} from "../../models/painting.model";
import {Subscription} from "rxjs";
import {CommonModule} from "@angular/common";
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-painting-list',
  templateUrl: './painting-list.component.html',
  styleUrls: ['./painting-list.component.scss']
})
export class PaintingListComponent implements OnInit {

  public paintings: PaintingModel[] = [];
  private paintingSubscription: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.paintingSubscription = this.dataService.paintings$.subscribe(paintings => {
      this.paintings = paintings;
    });
  }

}
