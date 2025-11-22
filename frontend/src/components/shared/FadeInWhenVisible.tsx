import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { fadeInUp } from "@/constants/animations";

interface FadeInWhenVisibleProps {
  children: ReactNode;
  className?: string;
}

export const FadeInWhenVisible = ({ children, className = "" }: FadeInWhenVisibleProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
};
