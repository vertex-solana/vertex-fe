import { motion } from "framer-motion";
import CodeBlock from "@/components/ui/code-block";

const howItWorksCode = `// Example of a complete indexer definition
import { createIndexer, defineSchema } from '@solindex/core';
import { PublicKey } from '@solana/web3.js';

// Define the database schema
const swapSchema = defineSchema({
  swaps: {
    id: 'string', // primary key
    amountIn: 'bigint',
    amountOut: 'bigint',
    tokenInMint: 'string',
    tokenOutMint: 'string',
    user: 'string',
    timestamp: 'timestamp',
    txSignature: 'string',
    slot: 'number'
  }
});

// Create the indexer
const dexIndexer = createIndexer({
  name: 'dex-swaps',
  programId: 'DEX1111111111111111111111111111111111111111',
  schema: swapSchema,
  startSlot: 200000000,  // Start indexing from specific slot
  
  async process(event, context) {
    if (event.name !== 'swap') return;
    
    const {
      tokenInAmount,
      tokenOutAmount,
      tokenInMint,
      tokenOutMint
    } = event.data;
    
    const user = event.accounts[0];
    
    await context.store.insert('swaps', {
      id: event.signature + '-' + event.logIndex,
      amountIn: tokenInAmount,
      amountOut: tokenOutAmount,
      tokenInMint: tokenInMint.toString(),
      tokenOutMint: tokenOutMint.toString(),
      user: user.toString(),
      timestamp: event.blockTime 
        ? new Date(event.blockTime * 1000) 
        : new Date(),
      txSignature: event.signature,
      slot: event.slot
    });
  }
});`;

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">Build powerful indexers in minutes with our intuitive workflow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Step 1 */}
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="bg-card border border-primary-500/30 h-16 w-16 rounded-full flex items-center justify-center text-primary-500 text-2xl font-bold shadow-lg shadow-primary-500/10">
                1
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Define Your Indexer</h3>
            <p className="text-muted-foreground text-center">Specify which Solana program to index and set up your triggers and listeners.</p>
            
            {/* Connector */}
            <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-500 to-blue-500 transform -translate-x-4"></div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="bg-card border border-blue-500/30 h-16 w-16 rounded-full flex items-center justify-center text-blue-500 text-2xl font-bold shadow-lg shadow-blue-500/10">
                2
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Upload IDL or Schema</h3>
            <p className="text-muted-foreground text-center">Upload your program's IDL to auto-generate schemas or define custom data structures.</p>
            
            {/* Connector */}
            <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transform -translate-x-4"></div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="bg-card border border-green-500/30 h-16 w-16 rounded-full flex items-center justify-center text-green-500 text-2xl font-bold shadow-lg shadow-green-500/10">
                3
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Write Processing Scripts</h3>
            <p className="text-muted-foreground text-center">Create scripts that transform, filter, and enrich your data during indexing.</p>
            
            {/* Connector */}
            <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-green-500 to-primary-500 transform -translate-x-4"></div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="bg-card border border-primary-500/30 h-16 w-16 rounded-full flex items-center justify-center text-primary-500 text-2xl font-bold shadow-lg shadow-primary-500/10">
                4
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Connect & Query</h3>
            <p className="text-muted-foreground text-center">Use automatically generated APIs to query your indexed data via GraphQL or REST.</p>
          </div>
        </div>

        <motion.div 
          className="bg-card rounded-xl p-6 border border-border/50 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <CodeBlock 
            code={howItWorksCode}
            fileName="indexer.ts"
            language="typescript"
          />
        </motion.div>
      </div>
    </section>
  );
}
