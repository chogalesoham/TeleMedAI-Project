import { motion } from "framer-motion";
import { Heart, Stethoscope, Clock, Brain, Shield, TrendingUp } from "lucide-react";
import { FadeInWhenVisible } from "@/components/shared/FadeInWhenVisible";
import { slideInLeft, slideInRight } from "@/constants/animations";

export const ForUsersSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInWhenVisible className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Built for <span className="text-gradient">Everyone</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tailored experiences for both patients and healthcare providers
          </p>
        </FadeInWhenVisible>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* For Patients */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            className="group"
          >
            <div className="h-full p-8 lg:p-10 rounded-3xl glass-card border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold">For Patients</h3>
              </div>

              <p className="text-lg text-muted-foreground mb-8">
                Experience healthcare that understands and supports you every step of the way
              </p>

              <ul className="space-y-4">
                {[
                  { icon: Clock, text: "Never miss medications with smart reminders" },
                  { icon: Shield, text: "Complete privacy with HIPAA-compliant security" },
                  { icon: Brain, text: "AI helps you articulate symptoms clearly" },
                  { icon: TrendingUp, text: "Track your health progress over time" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* For Doctors */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInRight}
            className="group"
          >
            <div className="h-full p-8 lg:p-10 rounded-3xl glass-card border-2 border-border hover:border-accent/50 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold">For Doctors</h3>
              </div>

              <p className="text-lg text-muted-foreground mb-8">
                Focus on what matters most - providing excellent care with AI support
              </p>

              <ul className="space-y-4">
                {[
                  { icon: Clock, text: "Save 40% consultation time with AI notes" },
                  { icon: Brain, text: "Get intelligent diagnosis suggestions" },
                  { icon: Shield, text: "Reduce prescription errors with AI checks" },
                  { icon: TrendingUp, text: "Access complete patient history instantly" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
