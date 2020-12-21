import {AddressModel} from './address.model';

export interface UserModel {
  basket: number[];
  address: AddressModel;
}
