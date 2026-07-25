import { IProduct } from '../../types/index.ts'

export class ProductsCart {
	private cart: IProduct[]

	constructor() {
		this.cart = []
	}

	getCart(): IProduct[] {
		return [...this.cart]
	}

	saveProduct(product: IProduct): void {
		this.cart.push(product)
	}

	deleteProduct(product: IProduct): void {
		const newCart = this.cart.filter((i) => {
			return i !== product
		})

		this.cart = newCart
	}

	clearCart(): void {
		this.cart.length = 0
	}

	getFullPrice(): number {
		let fullPrice = 0
		this.cart.forEach((p: IProduct): void => {
			if (p.price !== null) {
				fullPrice += p.price
			}
		})

		return fullPrice
	}

	productsQuantity(): number {
		return this.cart.length
	}

	checkProductById(id: string): boolean {
		return this.cart.some(p => p.id === id)
	}
}
