import {PaintingModel} from "./painting.model";

export interface RequestBasketResponseModel {
  id: number;
  items: PaintingModel[];
}
