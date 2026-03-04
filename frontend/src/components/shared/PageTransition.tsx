'use client'
import { motion } from 'framer-motion'

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  )
}
