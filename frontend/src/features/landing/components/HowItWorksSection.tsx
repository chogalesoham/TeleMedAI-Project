import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { steps } from "@/constants/steps";
import { FadeInWhenVisible } from "@/components/shared/FadeInWhenVisible";
import { fadeInUp } from "@/constants/animations";

export const HowItWorksSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Connecting lines background */}
      <div className="absolute inset-0 hidden lg:block">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <line x1="25%" y1="50%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="50%" y1="50%" x2="75%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInWhenVisible className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Three simple steps to smarter, more efficient healthcare
          </p>
        </FadeInWhenVisible>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = Icons[step.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            return (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Step number */}
                <div className="absolute -top-6 -left-2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white shadow-xl glow-primary z-10">
                  {step.number}
                </div>

                {/* Card */}
                <div className="h-full p-8 pt-14 rounded-2xl glass-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                    {Icon && <Icon className="w-8 h-8 text-primary" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-center">{step.description}</p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <Icons.ArrowRight className="w-8 h-8 text-primary/40" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
