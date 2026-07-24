import { ICustomer } from '../../types/index.ts';

export class Customer {
  private payment: ICustomer["payment"];
  private address: ICustomer["address"];
  private email: ICustomer["email"];
  private phone: ICustomer["phone"];

  constructor() {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  saveData(customers: Partial<ICustomer>): void {
    Object.assign(this, customers);
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
    this.payment = ''
    this.address = ''
    this.email = ''
    this.phone = ''
  }

  validateData(): { payment?: string; address?: string; email?: string; phone?: string } {
    const errors: { payment?: string; address?: string; email?: string; phone?: string } = {};

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