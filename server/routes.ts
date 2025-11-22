import type { Express } from "express";
import { createServer, type Server } from "http";
import { dbStorage } from "./db-storage";
import { insertCartItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await dbStorage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await dbStorage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/cart", async (_req, res) => {
    try {
      const cartItems = await dbStorage.getCartItems();
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      
      const product = await dbStorage.getProduct(validatedData.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const cartItem = await dbStorage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  app.patch("/api/cart/:productId", async (req, res) => {
    try {
      const { quantity } = req.body;
      
      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      if (quantity === 0) {
        const success = await dbStorage.removeFromCart(req.params.productId);
        if (!success) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        return res.status(204).send();
      }

      const cartItem = await dbStorage.updateCartItem(req.params.productId, quantity);
      
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:productId", async (req, res) => {
    try {
      const success = await dbStorage.removeFromCart(req.params.productId);
      
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (_req, res) => {
    try {
      await dbStorage.clearCart();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
