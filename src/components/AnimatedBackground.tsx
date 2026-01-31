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
                            backgroundColor: theme === 'dark' ? 0x020617 : 0xddeef7,
                            skyColor: theme === 'dark' ? 0x010b1a : 0x56a4c2,
                            cloudColor: theme === 'dark' ? 0x1e293b : 0x86a6b8,
                            cloudShadowColor: theme === 'dark' ? 0x000000 : 0x0e1d29,
                            sunColor: theme === 'dark' ? 0x2563eb : 0xff9919,
                            sunGlareColor: theme === 'dark' ? 0x1e3a8a : 0xff6633,
                            sunlightColor: theme === 'dark' ? 0x3b82f6 : 0xff9933,
                            speed: 1.0
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
                backgroundColor: theme === 'dark' ? 0x020617 : 0xddeef7,
                skyColor: theme === 'dark' ? 0x010b1a : 0x56a4c2,
                cloudColor: theme === 'dark' ? 0x1e293b : 0x86a6b8,
                cloudShadowColor: theme === 'dark' ? 0x000000 : 0x0e1d29,
                sunColor: theme === 'dark' ? 0x2563eb : 0xff9919,
                sunGlareColor: theme === 'dark' ? 0x1e3a8a : 0xff6633,
                sunlightColor: theme === 'dark' ? 0x3b82f6 : 0xff9933,
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
