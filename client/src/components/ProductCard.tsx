import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  quantity?: number;
  onAddToCart: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
}

export function ProductCard({ product, quantity = 0, onAddToCart, onUpdateQuantity }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-200" data-testid={`card-product-${product.id}`}>
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
            data-testid={`img-product-${product.id}`}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full">
          <h3 className="text-lg font-medium text-foreground line-clamp-1" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground" data-testid={`text-price-${product.id}`}>
              ${product.price}
            </span>
            <span className="text-sm text-muted-foreground">/ {product.unit}</span>
          </div>
        </div>

        {quantity === 0 ? (
          <Button
            className="w-full"
            onClick={() => onAddToCart(product.id)}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdateQuantity?.(product.id, Math.max(0, quantity - 1))}
              data-testid={`button-decrease-${product.id}`}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-base font-medium min-w-8 text-center" data-testid={`text-quantity-${product.id}`}>
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdateQuantity?.(product.id, quantity + 1)}
              data-testid={`button-increase-${product.id}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
