import { Injectable } from '@angular/core';
import {PathModel} from '../models/path.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  public getFullPath(pathModel: PathModel): string {
    return environment.apiUrl + '/public/images/' + pathModel.path;
  }
}
