import { motion } from 'framer-motion'

const techStack = [
    { name: 'React', id: 'react' },
    { name: 'Node.js', id: 'nodedotjs' },
    { name: 'Docker', id: 'docker' },
    { name: 'TypeScript', id: 'typescript' },
    { name: 'TailwindCSS', id: 'tailwindcss' },
    { name: 'Supabase', id: 'supabase' },
    { name: 'Next.js', id: 'nextdotjs' },
    { name: 'Vite', id: 'vite' },
    { name: 'GitHub', id: 'github' },
    { name: 'Kubernetes', id: 'kubernetes' },
    { name: 'Python', id: 'python' },
    { name: 'Go', id: 'go' },
    { name: 'PostgreSQL', id: 'postgresql' },
    { name: 'Linux', id: 'linux' },
]

export default function TechStackFlow() {
    // Duplicate the stack for infinite scroll
    const doubledStack = [...techStack, ...techStack]

    return (
        <div className="w-full py-10 relative overflow-hidden select-none">
            {/* Removed the 'box edges' (hard gradients) as requested for a cleaner, edge-to-edge feel */}

            <motion.div
                className="flex items-center gap-16 md:gap-24 whitespace-nowrap px-4"
                animate={{
                    x: ["0%", "-50%"]
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {doubledStack.map((tech, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 group transition-all duration-500"
                    >
                        <img
                            src={`https://cdn.simpleicons.org/${tech.id}/000000`}
                            alt={tech.name}
                            loading="lazy"
                            className="w-6 h-6 md:w-8 md:h-8 object-contain opacity-50 dark:invert dark:opacity-40 group-hover:opacity-100 dark:group-hover:opacity-100 transition-opacity duration-300 filter"
                        />
                        <span className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] text-black/40 dark:text-white/30 group-hover:text-black dark:group-hover:text-white transition-all duration-300 uppercase">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
