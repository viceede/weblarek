import { IApi, IOrder, IOrderResponse, IProductsResponse } from '../../types'

export class AppApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/').then((data) => data);
  }

  createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order).then((data) => data);
  }
}