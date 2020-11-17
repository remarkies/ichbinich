import {AddressModel} from "./address.model";
import {PaintingModel} from "./painting.model";

export interface CheckOutModel {
  basket: PaintingModel[];
  address: AddressModel;
}
