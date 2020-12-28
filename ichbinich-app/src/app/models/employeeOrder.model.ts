import {EmployeeOrderItemModel} from './employeeOrderItem.model';

export class EmployeeOrderModel {
  id: number;
  orderDateTime: Date;
  orderItemsCount: number;
  orderStateId: number;
  orderState: string;
  selected = false;
  orderValue: number;
  company: string;
  title: string;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  items: EmployeeOrderItemModel[];
}
