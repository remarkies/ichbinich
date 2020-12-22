import {PathModel} from "./path.model";

export interface PaintingModel {
  id: number;
  name: string;
  style_id: number;
  style: string;
  technique_id: number;
  technique: string;
  underground_id: number;
  underground: string;
  height: number;
  width: number;
  depth: number;
  price: number;
  collection_id: number;
  collection: string;
  series_id: number;
  series: string;
  sold: number;
  paths: PathModel[];
}
