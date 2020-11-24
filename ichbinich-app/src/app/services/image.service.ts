import { Injectable } from '@angular/core';
import {PathModel} from "../models/path.model";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  public getFullPath(pathModel: PathModel) : string {
    return "http://localhost:3000/public/images/" + pathModel.path;
  }
}
