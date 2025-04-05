import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type PricingTierProps = {
  name: string;
  description: string;
  price: string;
  unit: string;
  features: Array<{ text: string; available: boolean }>;
  buttonText: string;
  buttonVariant: "default" | "outline";
  popular?: boolean;
  delay: number;
};

const tierAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: delay * 0.2
    }
  })
};

function PricingTier({
  name,
  description,
  price,
  unit,
  features,
  buttonText,
  buttonVariant,
  popular = false,
  delay
}: PricingTierProps) {
  return (
    <motion.div 
      className={`bg-card rounded-xl overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        popular 
          ? "border border-primary-500/30 hover:shadow-primary-900/20" 
          : "border border-border/50 hover:shadow-background/10"
      }`}
      variants={tierAnimation}
      custom={delay}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-primary text-xs px-3 py-1 font-semibold text-white rounded-bl-lg">
          Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">/{unit}</span>
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.available ? (
                <Check className={`h-5 w-5 ${popular ? "text-primary-400" : popular === false && name === "Enterprise" ? "text-green-500" : "text-blue-400"} mr-2 mt-0.5 flex-shrink-0`} />
              ) : (
                <X className="h-5 w-5 text-muted-foreground/50 mr-2 mt-0.5 flex-shrink-0" />
              )}
              <span className={!feature.available ? "text-muted-foreground/50" : ""}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        <a href="#early-access">
          <Button 
            variant={buttonVariant} 
            className={`w-full ${buttonVariant === "default" ? "" : "bg-card hover:bg-card/80"}`}
          >
            {buttonText}
          </Button>
        </a>
      </div>
    </motion.div>
  );
}

export default function PricingSection() {
  const tiers = [
    {
      name: "Free",
      description: "Perfect for hobbyists and small projects",
      price: "$0",
      unit: "month",
      features: [
        { text: "2 indexers", available: true },
        { text: "100K API calls per month", available: true },
        { text: "1GB storage", available: true },
        { text: "Community support", available: true },
        { text: "Custom domains", available: false },
        { text: "Priority indexing", available: false },
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      delay: 0
    },
    {
      name: "Pro",
      description: "For teams building serious dApps",
      price: "$99",
      unit: "month",
      features: [
        { text: "10 indexers", available: true },
        { text: "2M API calls per month", available: true },
        { text: "20GB storage", available: true },
        { text: "Email support", available: true },
        { text: "Custom domains", available: true },
        { text: "Dedicated infrastructure", available: false },
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const,
      popular: true,
      delay: 1
    },
    {
      name: "Enterprise",
      description: "For high-traffic dApps and enterprises",
      price: "Custom",
      unit: "month",
      features: [
        { text: "Unlimited indexers", available: true },
        { text: "Custom API call limits", available: true },
        { text: "Unlimited storage", available: true },
        { text: "Priority support with SLA", available: true },
        { text: "Custom domains", available: true },
        { text: "Dedicated infrastructure", available: true },
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      delay: 2
    }
  ];

  return (
    <section id="pricing" className="py-20 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Flexible Pricing for Every Need</h2>
          <p className="text-lg text-muted-foreground">Start for free, scale as you grow with transparent pricing</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {tiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
