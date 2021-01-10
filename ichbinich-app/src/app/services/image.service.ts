import { Injectable } from '@angular/core';
import {PathModel} from '../models/path.model';
import {environment} from '../../environments/environment';
import {ApiService} from './api.service';
import {AuthenticationService} from './authentication.service';
import {PaintingService} from './painting.service';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private apiService: ApiService, private paintingService: PaintingService, private dataService: DataService, private authenticationService: AuthenticationService) { }

  public getFullPath(pathModel: PathModel): string {
    if (pathModel?.path) {
      return environment.apiUrl + '/public/images/' + pathModel.path;
    } else {
      return '';
    }
  }

  public getImageWithPath(path: string): string {
    return environment.apiUrl + '/public/images/' + path;
  }

  public deleteImage(imageId: number, paintingId: number): void {
    const currentEmployee = this.authenticationService.currentEmployeeValue;
    if (currentEmployee !== null) {
      this.apiService.deleteImage(currentEmployee.token, imageId).subscribe(() => {
        this.paintingService.loadPainting(paintingId);
        this.dataService.loadPaintings();
      });
    } else {
      console.log('Current employee not loaded.');
    }
  }

  uploadImage(file: File, id: number) {
    return this.apiService.uploadImage(this.authenticationService.currentEmployeeValue.token, id, file);
  }
}
