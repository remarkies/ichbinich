import {Component, Input, OnInit} from '@angular/core';
import {PathModel} from '../../../models/path.model';
import {PaintingModel} from '../../../models/painting.model';
import {DataService} from '../../../services/data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-image-group',
  templateUrl: './image-group.component.html',
  styleUrls: ['./image-group.component.scss']
})
export class ImageGroupComponent implements OnInit {


  public selectedPainting: PaintingModel;
  private paintingSubscription: Subscription;

  public selectedPath: PathModel;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    this.paintingSubscription = this.dataService.selectedPainting$.subscribe(painting => {
      this.selectedPainting = painting;
      this.selectedPath = painting.paths[0];
    });
  }

  public selectImage(selectedPath) {
    this.selectedPath = selectedPath;
  }

}
