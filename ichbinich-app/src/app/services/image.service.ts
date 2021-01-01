import { Injectable } from '@angular/core';
import {PathModel} from '../models/path.model';
import {environment} from '../../environments/environment';
import {ApiService} from './api.service';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private apiService: ApiService, private authenticationService: AuthenticationService) { }

  public getFullPath(pathModel: PathModel): string {
    return environment.apiUrl + '/public/images/' + pathModel.path;
  }

  public deleteImage(id: number): void {
    const currentEmployee = this.authenticationService.currentEmployeeValue;
    if (currentEmployee !== null) {
      this.apiService.deleteImage(currentEmployee.token, id).subscribe(() => {
        console.log('image deleted');
      });
    } else {
      console.log('Current employee not loaded.');
    }
  }

  uploadImage(file: File, id: number) {
    return this.apiService.uploadImage(this.authenticationService.currentEmployeeValue.token, id, file);
  }
}
