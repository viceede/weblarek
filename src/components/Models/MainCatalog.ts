
import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class MainCatalog {
  private products: IProduct[];
  private selectedProduct: IProduct | null;

  constructor(protected events: IEvents) {
    this.products = [];
    this.selectedProduct = null;
  }

  saveProducts(products: IProduct[]): void{
    this.products = products;
    this.events.emit('catalog:changed')
  }

  getProducts(): IProduct[] {
    return [...this.products];
  }

  getProductById(id: string): IProduct | undefined {
    const product = this.products.find((product: IProduct) : boolean => {
      return product.id === id;
    })

    return product;
  }

  saveSelectedProduct(selectedProduct: IProduct): void {
    this.selectedProduct = selectedProduct;
    this.events.emit('preview:changed')
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
