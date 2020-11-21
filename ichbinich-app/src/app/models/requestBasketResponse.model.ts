import {PaintingModel} from "./painting.model";

export interface RequestBasketResponseModel {
  id: number;
  stripe_session_id: string;
  items: PaintingModel[];
}
