import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Sparkles, Stethoscope, CheckCircle2, Users, Shield, Zap, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-telemedicine.jpg";
import { fadeInUp, staggerContainer } from "@/constants/animations";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-blue-50/40 to-cyan-50/40">
      {/* Enhanced Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        
        {/* Floating Medical Icons */}
        <motion.div
          className="absolute top-32 left-16 text-primary/15"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Stethoscope size={48} strokeWidth={1.5} />
        </motion.div>
        <motion.div
          className="absolute bottom-48 right-32 text-accent/15"
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        >
          <Activity size={64} strokeWidth={1.5} />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-1/4 text-secondary/15"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={40} strokeWidth={1.5} />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 lg:pt-0">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Enhanced */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left space-y-8 mt-4"
          >
            {/* Badge with Icon */}
            <motion.div 
              variants={fadeInUp} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI-Powered Healthcare Platform
              </span>
            </motion.div>

            {/* Main Heading with Enhanced Typography */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight"
            >
              <span className="block text-foreground mb-1">
                Transform Your
              </span>
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
                Healthcare Journey
              </span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              variants={fadeInUp} 
              className="text-xl sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Experience intelligent telemedicine with AI-driven symptom analysis, 
              real-time consultation support, and personalized care management.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div 
              variants={fadeInUp} 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="font-medium">50k+ Patients</span>
              </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              variants={fadeInUp} 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                size="lg" 
                className="group text-base px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 py-6 border-2 hover:bg-accent/5 hover:border-accent transition-all duration-300"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Enhanced Status Indicators */}
            <motion.div 
              variants={fadeInUp} 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                </div>
                <span className="text-sm font-medium text-foreground">Available 24/7</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                </div>
                <span className="text-sm font-medium text-foreground">Live Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-purple-500 rounded-full animate-ping" />
                </div>
                <span className="text-sm font-medium text-foreground">AI-Powered</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Decorative Elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            
            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10" />
              <img
                src={heroImage}
                alt="AI-powered telemedicine consultation"
                className="w-full h-auto relative z-10 mix-blend-multiply"
              />
              
              {/* Enhanced Floating Cards */}
              <motion.div
                className="absolute top-8 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-primary/20"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [-2, 2, -2]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      98%
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Accuracy Rate
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-8 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-accent/20"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [2, -2, 2]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                      50k+
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Happy Patients
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-green-200"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-green-700">
                    Consultation Active
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
