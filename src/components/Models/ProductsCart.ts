import { IProduct } from '../../types/index.ts'

export class ProductsCart {
	private cart: IProduct[]

	constructor() {
		this.cart = []
	}

	getCart(): IProduct[] {
		return this.cart
	}

	saveProduct(product: IProduct): void {
		this.cart.push(product)
	}

	deleteProduct(product: IProduct): void {
		const index = this.cart.indexOf(product)
		if (index !== -1) {
			this.cart.splice(index, 1)
		}
	}

	clearCart(): void {
		this.cart.splice(0, this.cart.length)
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

	countProducts(): number {
		return this.cart.length
	}

	checkProduct(id: string): boolean {
		return this.cart.some(p => p.id === id)
	}
}
