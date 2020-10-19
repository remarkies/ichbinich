import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {PaintingModel} from "../../models/painting.model";
import {Subscription} from "rxjs";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-painting-list',
  templateUrl: './painting-list.component.html',
  styleUrls: ['./painting-list.component.scss']
})
export class PaintingListComponent implements OnInit {

  public paintings: PaintingModel[] = [];
  private paintingSubscription: Subscription;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.paintingSubscription = this.api.getPaintings().subscribe(paintings => {
      this.paintings = paintings;
      console.log(paintings);
    });
  }

  ngOnDestroy() {
    this.paintingSubscription.unsubscribe();
  }

}
