import { type Product, type InsertProduct, type CartItem, type InsertCartItem, type CartItemWithProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  
  getCartItems(): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(productId: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(productId: string): Promise<boolean>;
  clearCart(): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.seedProducts();
  }

  private seedProducts() {
    const productsData: Omit<Product, "id">[] = [
      {
        name: "Fresh Red Apples",
        description: "Crisp and sweet organic apples, perfect for snacking or baking",
        price: "3.99",
        category: "Fruits",
        image: "/generated_images/Fresh_red_apples_31cad875.png",
        unit: "lb",
        inStock: 150,
      },
      {
        name: "Organic Bananas",
        description: "Naturally ripened bananas, rich in potassium and fiber",
        price: "2.49",
        category: "Fruits",
        image: "/generated_images/Fresh_yellow_bananas_41c4417c.png",
        unit: "lb",
        inStock: 200,
      },
      {
        name: "Fresh Broccoli",
        description: "Farm-fresh broccoli crowns, packed with vitamins and nutrients",
        price: "2.99",
        category: "Vegetables",
        image: "/generated_images/Fresh_green_broccoli_d4f900ea.png",
        unit: "lb",
        inStock: 100,
      },
      {
        name: "Organic Carrots",
        description: "Sweet and crunchy carrots, great for snacking or cooking",
        price: "1.99",
        category: "Vegetables",
        image: "/generated_images/Fresh_orange_carrots_e4368fc1.png",
        unit: "lb",
        inStock: 180,
      },
      {
        name: "Fresh Whole Milk",
        description: "Farm-fresh whole milk, rich and creamy",
        price: "4.99",
        category: "Dairy",
        image: "/generated_images/Fresh_dairy_products_27b2da11.png",
        unit: "gallon",
        inStock: 75,
      },
      {
        name: "Greek Yogurt",
        description: "Creamy Greek yogurt, high in protein and probiotics",
        price: "5.99",
        category: "Dairy",
        image: "/generated_images/Fresh_dairy_products_27b2da11.png",
        unit: "32oz",
        inStock: 120,
      },
      {
        name: "Artisan Sourdough Bread",
        description: "Freshly baked sourdough with a crispy crust and soft interior",
        price: "6.99",
        category: "Bakery",
        image: "/generated_images/Fresh_bakery_bread_ad44bb5a.png",
        unit: "loaf",
        inStock: 50,
      },
      {
        name: "Whole Wheat Bread",
        description: "Nutritious whole wheat bread, perfect for sandwiches",
        price: "4.49",
        category: "Bakery",
        image: "/generated_images/Fresh_bakery_bread_ad44bb5a.png",
        unit: "loaf",
        inStock: 80,
      },
      {
        name: "Fresh Strawberries",
        description: "Sweet and juicy strawberries, locally grown",
        price: "5.99",
        category: "Fruits",
        image: "/generated_images/Fresh_fruits_category_a491df4e.png",
        unit: "lb",
        inStock: 90,
      },
      {
        name: "Blueberries",
        description: "Plump and flavorful blueberries, rich in antioxidants",
        price: "6.99",
        category: "Fruits",
        image: "/generated_images/Fresh_fruits_category_a491df4e.png",
        unit: "pint",
        inStock: 110,
      },
      {
        name: "Cherry Tomatoes",
        description: "Sweet cherry tomatoes, perfect for salads and snacking",
        price: "3.49",
        category: "Vegetables",
        image: "/generated_images/Fresh_vegetables_category_92dc0b00.png",
        unit: "lb",
        inStock: 130,
      },
      {
        name: "Organic Spinach",
        description: "Fresh organic spinach leaves, nutrient-dense and versatile",
        price: "3.99",
        category: "Vegetables",
        image: "/generated_images/Fresh_vegetables_category_92dc0b00.png",
        unit: "bunch",
        inStock: 95,
      },
      {
        name: "Sharp Cheddar Cheese",
        description: "Aged cheddar cheese with a bold, tangy flavor",
        price: "7.99",
        category: "Dairy",
        image: "/generated_images/Dairy_products_category_4c0e7657.png",
        unit: "8oz",
        inStock: 85,
      },
      {
        name: "Organic Eggs",
        description: "Farm-fresh organic eggs from free-range chickens",
        price: "5.49",
        category: "Dairy",
        image: "/generated_images/Dairy_products_category_4c0e7657.png",
        unit: "dozen",
        inStock: 140,
      },
      {
        name: "Croissants",
        description: "Buttery and flaky French croissants, freshly baked daily",
        price: "8.99",
        category: "Bakery",
        image: "/generated_images/Fresh_bakery_bread_ad44bb5a.png",
        unit: "6-pack",
        inStock: 60,
      },
      {
        name: "Bagels Variety Pack",
        description: "Assorted bagels including plain, sesame, and everything",
        price: "5.99",
        category: "Bakery",
        image: "/generated_images/Fresh_bakery_bread_ad44bb5a.png",
        unit: "6-pack",
        inStock: 70,
      },
    ];

    productsData.forEach((productData) => {
      const id = randomUUID();
      const product: Product = { ...productData, id };
      this.products.set(id, product);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getCartItems(): Promise<CartItemWithProduct[]> {
    const items: CartItemWithProduct[] = [];
    const cartItemsArray = Array.from(this.cartItems.values());
    
    for (const cartItem of cartItemsArray) {
      const product = await this.getProduct(cartItem.productId);
      if (product) {
        items.push({
          ...cartItem,
          product,
        });
      }
    }
    
    return items;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const existing = Array.from(this.cartItems.values()).find(
      (item) => item.productId === insertItem.productId
    );

    if (existing) {
      existing.quantity += (insertItem.quantity || 1);
      this.cartItems.set(existing.id, existing);
      return existing;
    }

    const id = randomUUID();
    const cartItem: CartItem = { 
      id, 
      productId: insertItem.productId,
      quantity: insertItem.quantity || 1
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(productId: string, quantity: number): Promise<CartItem | undefined> {
    const item = Array.from(this.cartItems.values()).find(
      (item) => item.productId === productId
    );

    if (!item) {
      return undefined;
    }

    if (quantity <= 0) {
      this.cartItems.delete(item.id);
      return undefined;
    }

    item.quantity = quantity;
    this.cartItems.set(item.id, item);
    return item;
  }

  async removeFromCart(productId: string): Promise<boolean> {
    const item = Array.from(this.cartItems.values()).find(
      (item) => item.productId === productId
    );

    if (!item) {
      return false;
    }

    return this.cartItems.delete(item.id);
  }

  async clearCart(): Promise<void> {
    this.cartItems.clear();
  }
}

export const storage = new MemStorage();
