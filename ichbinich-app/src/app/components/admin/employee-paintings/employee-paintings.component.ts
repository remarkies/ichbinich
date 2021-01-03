import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data.service';
import {Subscription} from 'rxjs';
import {PaintingModel} from '../../../models/painting.model';
import {Router} from '@angular/router';
import {ImageService} from '../../../services/image.service';

@Component({
  selector: 'app-employee-paintings',
  templateUrl: './employee-paintings.component.html',
  styleUrls: ['./employee-paintings.component.scss']
})
export class EmployeePaintingsComponent implements OnInit {

  public isNewPaintingViewVisible = false;

  public paintings: PaintingModel[] = [];
  private paintingsSubscription: Subscription;

  constructor(private dataService: DataService, private imageService: ImageService, private router: Router) { }

  ngOnInit(): void {
    this.paintingsSubscription = this.dataService.paintings$.subscribe(paintings => {
      this.paintings = paintings;
    });
  }

  public getImage(painting: PaintingModel) {
    if (painting.paths.length > 0) {
      return this.imageService.getFullPath(painting.paths[0]);
    } else {
      return '';
    }
  }

  selectPainting(painting: PaintingModel): void {
    const index = this.paintings.indexOf(painting);
    this.paintings[index].selected = !this.paintings[index].selected;

    for (const o of this.paintings) {
      if (o.id !== this.paintings[index].id) {
        o.selected = false;
      }
    }
  }

  editPainting(painting: PaintingModel): void {
    this.router.navigate(['/user/painting', painting.id]);
  }

  addPainting(): void {
    this.isNewPaintingViewVisible = true;
  }

  closeNewPaintingView(): void {
    this.isNewPaintingViewVisible = false;
  }

}
