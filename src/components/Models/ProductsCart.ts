import { IProduct } from '../../types/index.ts';

export class ProductsCart {
  private products: IProduct[];
  
  constructor() {
    this.products = [];
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  saveProduct(product: IProduct): void {
    this.products.push(product);
  }
}