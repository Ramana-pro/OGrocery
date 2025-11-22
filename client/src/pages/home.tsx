import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { CartSheet } from "@/components/CartSheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product, CartItemWithProduct } from "@shared/schema";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest("POST", "/api/cart", { productId, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (quantity === 0) {
        return apiRequest("DELETE", `/api/cart/${productId}`, {});
      }
      return apiRequest("PATCH", `/api/cart/${productId}`, { quantity });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      if (variables.quantity === 0) {
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart",
        });
      }
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest("DELETE", `/api/cart/${productId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    },
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProductQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.productId === productId);
    return item?.quantity || 0;
  };

  const handleStartShopping = () => {
    const productsSection = document.getElementById("products-section");
    productsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCheckout = () => {
    setCartOpen(false);
    toast({
      title: "Checkout",
      description: "Checkout functionality coming soon!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Hero onStartShopping={handleStartShopping} />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" id="products-section">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            {selectedCategory || "All Products"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No products found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getProductQuantity(product.id)}
                onAddToCart={(productId) => addToCartMutation.mutate(productId)}
                onUpdateQuantity={(productId, quantity) =>
                  updateQuantityMutation.mutate({ productId, quantity })
                }
              />
            ))}
          </div>
        )}
      </main>

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        cartItems={cartItems}
        onUpdateQuantity={(productId, quantity) =>
          updateQuantityMutation.mutate({ productId, quantity })
        }
        onRemoveItem={(productId) => removeItemMutation.mutate(productId)}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
