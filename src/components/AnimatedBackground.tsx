import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

interface AnimatedBackgroundProps {
    className?: string;
    absolute?: boolean;
}

export default function AnimatedBackground({ className = "", absolute = false }: AnimatedBackgroundProps) {
    const [vantaEffect, setVantaEffect] = useState<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { theme } = useTheme()

    useEffect(() => {
        if (!vantaEffect && containerRef.current) {
            const initVanta = () => {
                if ((window as any).VANTA && (window as any).VANTA.CLOUDS) {
                    try {
                        const effect = (window as any).VANTA.CLOUDS({
                            el: containerRef.current,
                            mouseControls: true,
                            touchControls: true,
                            gyroControls: false,
                            minHeight: 200.00,
                            minWidth: 200.00,
                            backgroundColor: theme === 'dark' ? 0x010204 : 0xddeef7,
                            skyColor: theme === 'dark' ? 0x050810 : 0xbadceb,
                            cloudColor: theme === 'dark' ? 0x1e2025 : 0xffffff,
                            cloudShadowColor: theme === 'dark' ? 0x000000 : 0xb8c9d4,
                            sunColor: 0x3b82f6,
                            sunGlareColor: 0x2563eb,
                            sunlightColor: 0x3b82f6,
                            speed: 0.8
                        })
                        setVantaEffect(effect)
                    } catch (err) {
                        console.error("Vanta initialization failed:", err)
                    }
                } else {
                    setTimeout(initVanta, 100)
                }
            }
            initVanta()
        }

        // Update colors when theme changes if effect already exists
        if (vantaEffect) {
            vantaEffect.setOptions({
                backgroundColor: theme === 'dark' ? 0x010204 : 0xddeef7,
                skyColor: theme === 'dark' ? 0x050810 : 0xbadceb,
                cloudColor: theme === 'dark' ? 0x1e2025 : 0xffffff,
                cloudShadowColor: theme === 'dark' ? 0x000000 : 0xb8c9d4,
                sunColor: 0x3b82f6,
                sunGlareColor: 0x2563eb,
                sunlightColor: 0x3b82f6,
            })
        }

        return () => {
            // We don't necessarily want to destroy on every theme change if we can just update options
            // but for full color reset sometimes destroy/re-init is safer. 
            // Vanta setOptions works for most properties.
        }
    }, [theme, vantaEffect])

    useEffect(() => {
        return () => {
            if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect])

    return (
        <div
            ref={containerRef}
            className={`${absolute ? 'absolute' : 'fixed'} inset-0 w-full h-full -z-50 bg-black pointer-events-none transition-colors duration-700 ${className}`}
            style={{
                minHeight: absolute ? '100%' : '100vh',
                minWidth: absolute ? '100%' : '100vw'
            }}
        />
    )
}
