import { Component, OnInit } from '@angular/core';
import {PaintingModel} from '../../models/painting.model';
import {Subscription} from 'rxjs';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-paintings',
  templateUrl: './paintings.component.html',
  styleUrls: ['./paintings.component.scss'],
})
export class PaintingsComponent implements OnInit {

  public selectedPainting: PaintingModel;
  private selectedPaintingSubscription: Subscription;

  public paintings: PaintingModel[] = [];
  private paintingSubscription: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.paintingSubscription = this.dataService.paintings$.subscribe(paintings => {
      if (paintings !== null) {
        this.paintings = paintings;
        if (paintings.length > 0) {
          this.dataService.selectPainting(paintings[0]);
        }
      }
    });

    this.selectedPaintingSubscription = this.dataService.selectedPainting$.subscribe(painting => {
      this.selectedPainting = painting;
    });
  }

}
