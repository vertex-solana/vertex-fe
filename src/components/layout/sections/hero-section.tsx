import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CodeBlock from "@/components/ui/code-block";
import { ArrowRight, Wand2 } from "lucide-react";

const heroCodeExample = `// Define a custom indexer for tracking NFT mints
import { createIndexer, EventType } from '@solindex/core';
import { NFT_PROGRAM_ID } from './constants';

const nftIndexer = createIndexer({
  name: 'nft-mint-tracker',
  programId: NFT_PROGRAM_ID,
  startSlot: 'latest',
  filters: [{ eventType: EventType.INSTRUCTION, name: 'mintNFT' }],
  async process(event, context) {
    const { accounts, data } = event;
    
    // Extract relevant data from the transaction
    const mintAddress = accounts[0];
    const metadata = await context.fetchMetadata(mintAddress);
    
    // Store the indexed data
    await context.store.insert('nft_mints', {
      mint_address: mintAddress,
      owner: accounts[1],
      name: metadata.name,
      uri: metadata.uri,
      timestamp: new Date().toISOString()
    });
  }
});

// Start the indexer
nftIndexer.start();`;

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-16 md:py-24 border-b border-border"
    >
      {/* Background gradient and pattern */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-primary-400">Modular Indexing</span> &{" "}
            <span className="text-blue-400">Query Layer</span> for Solana
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Plug, script, and stream your Solana data – in real-time.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a href="#early-access">
              <Button size="lg" className="group">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a
              href="https://docs.solindexprotocol.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="group">
                Read the Docs
                <Wand2 className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Developer-first
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Modular design
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Real-time streaming
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Scriptable indexers
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="max-w-4xl mx-auto"
        >
          <CodeBlock
            code={heroCodeExample}
            fileName="index.ts"
            language="typescript"
          />
        </motion.div>
      </div>
    </section>
  );
}
