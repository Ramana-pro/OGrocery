import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_farmers_market_scene_edfcd138.png";

interface HeroProps {
  onStartShopping: () => void;
}

export function Hero({ onStartShopping }: HeroProps) {
  return (
    <div className="relative w-full overflow-hidden bg-muted">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Fresh produce at farmers market"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Fresh Groceries Delivered to Your Door
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl">
              Shop from our selection of farm-fresh produce, quality dairy, artisan bakery items, and more. 
              Get the freshest ingredients delivered straight to your home.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="text-base"
                onClick={onStartShopping}
                data-testid="button-start-shopping"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base bg-background/10 backdrop-blur-sm border-white/20 text-white hover:bg-background/20"
              >
                Browse Categories
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
