export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TCustomerErrors = Partial<Record<keyof ICustomer, string>>;
export type TPayment = 'card' | 'cash';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
};

export interface ICustomer {
    payment: TPayment | null;
    address: string;
    email: string;
    phone: string;
};

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrder extends ICustomer{
    total: number;
    items: string[];
}

export interface IOrderResponse { 
    id: string;
    total: number;
}

export interface ICardActions {
    onClick: () => void;
}

export interface IFormActions {
    onSubmit: () => void;
}

export interface IBasket {
  fullPrice: number;
  buttonState: boolean;
  basketList: HTMLElement[];
}

export interface ICard {
  title: string;
  price: number | null;
}

export interface ICardBasket {
  index: number;
}

export interface ICardCatalog {
  category: string;
  image: string;
}

export interface ICardPreview {
  category: string;
  image: string;
  description: string;
  buttonText: string,
  buttonDisabled: boolean
}

export interface IContactsForm {
  email: string;
  phone: string;
}

export interface IForm {
  valid: boolean;
  errorText: string;
}

export interface IGallery {
  catalog: HTMLElement[];
}

export interface IHeader {
  counter: number;
}

export interface IModal {
  content: HTMLElement;
}

export interface IOrderForm {
  payment: TPayment | null;
  address: string;
}

export interface ISuccess {
  total: number;
}