import { Wallet, MessageSquare, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your Web3 wallet securely in seconds"
  },
  {
    icon: MessageSquare,
    title: "Ask Lumi",
    description: "Chat naturally about your crypto questions"
  },
  {
    icon: Lightbulb,
    title: "Get Insights",
    description: "Receive instant, actionable information"
  }
];

export function HowItWorks() {
  return (
    <section className="py-5 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl text-white">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get started with Lumi in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
      
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-blue-500/50 to-transparent"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
         
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm z-10">
                  {index + 1}
                </div>
                
             
                <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 border border-gray-700 flex items-center justify-center mt-4 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <step.icon className="w-12 h-12 text-blue-400 relative z-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
