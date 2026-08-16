import { ICustomer } from '../../types/index.ts';
import { TCustomerErrors } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class Customer {
  private payment: ICustomer["payment"];
  private address: ICustomer["address"];
  private email: ICustomer["email"];
  private phone: ICustomer["phone"];

  constructor(protected events: IEvents) {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  saveData(customer: Partial<ICustomer>): void {
    if (customer.payment !== undefined) this.payment = customer.payment;
    if (customer.address !== undefined) this.address = customer.address;
    if (customer.email !== undefined) this.email = customer.email;
    if (customer.phone !== undefined) this.phone = customer.phone;

    this.events.emit('customer:changed');
  }

  getData(): ICustomer{
      return {
        payment: this.payment,
        address: this.address,
        email: this.email,
        phone: this.phone,
      };
    }

  clearData(): void {
    this.payment = null
    this.address = ''
    this.email = ''
    this.phone = ''

    this.events.emit('customer:changed');
  }

  validateData(): TCustomerErrors {
    const errors: TCustomerErrors = {};

    if(!this.payment || this.payment.trim() === ''){
      errors.payment = 'Укажите способ оплаты';
    }

    if (!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this.email || this.email.trim() === ''){
      errors.email = 'Укажите E-mail';
    }

    if(!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите номер телефона'
    }

    return errors;
  }
}