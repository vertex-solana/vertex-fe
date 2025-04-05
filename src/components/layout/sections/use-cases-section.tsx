import { 
  Globe, 
  BarChart, 
  Server, 
  Search, 
  CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";

// Container animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

// Item animation
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

type UseCaseProps = {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  benefits: string[];
  checkColor: string;
};

function UseCase({ 
  icon, 
  iconBgColor, 
  iconColor, 
  title, 
  description, 
  benefits, 
  checkColor 
}: UseCaseProps) {
  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden border border-border/50"
      variants={itemVariants}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`${iconBgColor} h-10 w-10 rounded-lg flex items-center justify-center mr-4`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        <ul className="space-y-2 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className={`h-5 w-5 ${checkColor} mr-2 mt-0.5 flex-shrink-0`} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function UseCasesSection() {
  const useCases = [
    {
      icon: <Globe className="h-6 w-6" />,
      iconBgColor: "bg-primary-900/30",
      iconColor: "text-primary-400",
      title: "dApp Developers",
      description: "Build fast, reliable frontends for DeFi, NFT, and DAO applications with custom indexers that meet your exact data needs.",
      benefits: [
        "Create real-time data feeds for trading interfaces",
        "Track on-chain events to trigger notifications",
        "Generate custom user activity feeds and analytics"
      ],
      checkColor: "text-primary-400"
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      iconBgColor: "bg-blue-900/30",
      iconColor: "text-blue-400",
      title: "On-Chain Analysts",
      description: "Extract, transform, and analyze blockchain data without building complex infrastructure or relying on centralized services.",
      benefits: [
        "Create custom dashboards for protocol analytics",
        "Track wallet behavior and token flows",
        "Generate customized reports and alerting services"
      ],
      checkColor: "text-blue-400"
    },
    {
      icon: <Server className="h-6 w-6" />,
      iconBgColor: "bg-green-500/10",
      iconColor: "text-green-500",
      title: "Infrastructure Providers",
      description: "Build scalable infrastructure services on top of Sol Index to serve your customers with reliable Solana data access.",
      benefits: [
        "Offer specialized data services to clients",
        "Integrate with existing tools and services",
        "Build specialized data warehousing solutions"
      ],
      checkColor: "text-green-500"
    },
    {
      icon: <Search className="h-6 w-6" />,
      iconBgColor: "bg-primary-900/30",
      iconColor: "text-primary-400",
      title: "Explorers & Dashboards",
      description: "Build specialized blockchain explorers or dashboards with exactly the right data aggregation and display logic.",
      benefits: [
        "Create program-specific transaction explorers",
        "Build visualizations for specific on-chain metrics",
        "Deploy interactive data exploration tools"
      ],
      checkColor: "text-primary-400"
    }
  ];

  return (
    <section id="use-cases" className="py-20 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Who Uses Sol Index Protocol?</h2>
          <p className="text-lg text-muted-foreground">Powerful, flexible indexing for all Solana ecosystem participants</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {useCases.map((useCase, index) => (
            <UseCase key={index} {...useCase} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
