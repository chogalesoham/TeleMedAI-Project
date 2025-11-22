import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { problems } from "@/constants/problems";
import { FadeInWhenVisible } from "@/components/shared/FadeInWhenVisible";
import { staggerContainer, fadeInUp } from "@/constants/animations";

export const ProblemSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInWhenVisible className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            The Problems with <span className="text-gradient">Current Telemedicine</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Traditional telemedicine platforms fall short in delivering efficient, comprehensive care
          </p>
        </FadeInWhenVisible>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {problems.map((problem, index) => {
            const Icon = Icons[problem.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
              >
                <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                    {Icon && <Icon className="w-7 h-7 text-destructive" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
