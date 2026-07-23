
import { IProduct } from '../../types/index.ts';

export class MainCatalog {
  private products: IProduct[];
  private selectedProduct: IProduct | undefined;

  constructor() {
    this.products = [];
    this.selectedProduct = undefined;
  }

  saveProducts(products: IProduct[]): void{
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  saveSelectableProduct(selectedProduct: IProduct): void {
    this.selectedProduct = selectedProduct;
  }

  getSelectableProduct(): IProduct | undefined {
    return this.selectedProduct;
  }
}
