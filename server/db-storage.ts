import { db } from "../db";
import { products, cartItems } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { Product, InsertProduct, CartItem, InsertCartItem, CartItemWithProduct } from "@shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getCartItems(userId?: string): Promise<CartItemWithProduct[]> {
    const cartQuery = userId
      ? db.select().from(cartItems).where(eq(cartItems.userId, userId))
      : db.select().from(cartItems);
    
    const items = await cartQuery;
    
    const itemsWithProducts: CartItemWithProduct[] = [];
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        itemsWithProducts.push({
          ...item,
          product,
        });
      }
    }
    
    return itemsWithProducts;
  }

  async addToCart(item: InsertCartItem, userId?: string): Promise<CartItem> {
    const existing = userId
      ? await db.select().from(cartItems).where(
          and(eq(cartItems.productId, item.productId), eq(cartItems.userId, userId))
        )
      : await db.select().from(cartItems).where(eq(cartItems.productId, item.productId));

    if (existing.length > 0) {
      const updated = await db
        .update(cartItems)
        .set({ quantity: existing[0].quantity + (item.quantity || 1) })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updated[0];
    }

    const insertData: InsertCartItem = {
      productId: item.productId,
      quantity: item.quantity || 1,
      userId: userId || null,
    };

    const result = await db.insert(cartItems).values(insertData).returning();
    return result[0];
  }

  async updateCartItem(productId: string, quantity: number, userId?: string): Promise<CartItem | undefined> {
    const query = userId
      ? and(eq(cartItems.productId, productId), eq(cartItems.userId, userId))
      : eq(cartItems.productId, productId);
    
    const existing = await db.select().from(cartItems).where(query);
    
    if (existing.length === 0) {
      return undefined;
    }

    if (quantity <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, existing[0].id));
      return undefined;
    }

    const updated = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, existing[0].id))
      .returning();
    
    return updated[0];
  }

  async removeFromCart(productId: string, userId?: string): Promise<boolean> {
    const query = userId
      ? and(eq(cartItems.productId, productId), eq(cartItems.userId, userId))
      : eq(cartItems.productId, productId);
    
    const result = await db.delete(cartItems).where(query).returning();
    return result.length > 0;
  }

  async clearCart(userId?: string): Promise<void> {
    if (userId) {
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
    } else {
      await db.delete(cartItems);
    }
  }
}

export const dbStorage = new DbStorage();
