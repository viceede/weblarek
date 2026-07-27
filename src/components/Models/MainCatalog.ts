
import { IProduct } from '../../types/index.ts';

export class MainCatalog {
  private products: IProduct[];
  private selectedProduct: IProduct | null;

  constructor() {
    this.products = [];
    this.selectedProduct = null;
  }

  saveProducts(products: IProduct[]): void{
    this.products = products;
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
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
