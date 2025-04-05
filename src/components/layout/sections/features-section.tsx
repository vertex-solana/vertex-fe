import { 
  Puzzle, 
  Code2, 
  ShieldCheck, 
  Zap, 
  BarChart2, 
  FlaskRound 
} from "lucide-react";
import { motion } from "framer-motion";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  tagColor: string;
  delay: number;
};

// Container animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

// Card animation
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: delay * 0.1
    }
  })
};

function FeatureCard({ icon, title, description, tags, tagColor, delay }: FeatureCardProps) {
  return (
    <motion.div 
      className="bg-card rounded-xl p-6 border border-border/50 transition duration-300 hover:shadow-lg hover:-translate-y-1"
      variants={cardVariants}
      custom={delay}
    >
      <div className="text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="text-sm font-medium">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className={`inline-block ${tagColor} rounded px-2 py-1 mr-2 mb-2`}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <Puzzle className="h-10 w-10" />,
      title: "Modular Indexers",
      description: "Create multiple indexers per project, each with custom triggers and specific focus areas to efficiently process on-chain data.",
      tags: ["Custom Triggers", "Program-specific", "Composable"],
      tagColor: "bg-primary-900/30 text-primary-300",
      delay: 0
    },
    {
      icon: <Code2 className="h-10 w-10" />,
      title: "Scriptable Pipelines",
      description: "Write scripts in TypeScript, Rust, or Python to define exactly how your data is collected, transformed, and stored.",
      tags: ["Transform Data", "Custom Filters", "Data Enrichment"],
      tagColor: "bg-blue-900/30 text-blue-300",
      delay: 1
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: "Smart IDL Handling",
      description: "Upload your IDLs to automatically generate event listeners and strongly-typed schemas for your program's events.",
      tags: ["Auto-generation", "Type Safety", "Event Parsing"],
      tagColor: "bg-green-500/10 text-green-500",
      delay: 2
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Instant API",
      description: "Auto-generate GraphQL and REST endpoints from your indexed data, with built-in filtering, pagination, and subscription.",
      tags: ["GraphQL", "REST", "Webhooks"],
      tagColor: "bg-primary-900/30 text-primary-300",
      delay: 3
    },
    {
      icon: <BarChart2 className="h-10 w-10" />,
      title: "Analytics Dashboard",
      description: "Visualize throughput, lag, storage usage, and query frequency to optimize your indexers and monitor performance.",
      tags: ["Performance", "Monitoring", "Insights"],
      tagColor: "bg-blue-900/30 text-blue-300",
      delay: 4
    },
    {
      icon: <FlaskRound className="h-10 w-10" />,
      title: "Storage Backend",
      description: "Auto-create tables in PostgreSQL or integrate with your own database to store and query indexed data efficiently.",
      tags: ["PostgreSQL", "Custom DB", "Auto-schema"],
      tagColor: "bg-green-500/10 text-green-500",
      delay: 5
    }
  ];

  return (
    <section id="features" className="py-20 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">The Developer-First Indexing Solution</h2>
          <p className="text-lg text-muted-foreground">Sol Index Protocol gives you the flexibility and power to access, transform, and stream on-chain data exactly how you need it.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
