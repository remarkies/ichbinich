import { Injectable } from '@angular/core';
import {PathModel} from "../models/path.model";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  public getFullPath(pathModel: PathModel) : string {
    return "/assets/images/" + pathModel.path;
  }
}
