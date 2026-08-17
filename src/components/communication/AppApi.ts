import { IApi, IOrder, IOrderResponse, IProductsResponse } from '../../types'

export class AppApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    const data = this.api.get<IProductsResponse>('/product/')
    return data.then((data) => ({
      ...data,
      items: data.items.map((item) => ({
        ...item,
        image: item.image.replace(/\.svg$/i, '.png'),
      })),
    }));
  }

  createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}