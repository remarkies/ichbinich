import {AddressModel} from "./address.model";

export interface RequestAddressForBasketResponseModel {
  address: AddressModel;
  status: number;
  message: string;
}
