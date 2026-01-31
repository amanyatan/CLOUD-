import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

declare global {
    interface Window {
        VANTA: any
    }
}

export default function VantaClouds() {
    const vantaRef = useRef<HTMLDivElement>(null)
    const [vantaEffect, setVantaEffect] = useState<any>(0)

    useEffect(() => {
        const loadScripts = async () => {
            // Check if already loaded
            if (window.VANTA) return true

            return new Promise((resolve) => {
                const script = document.createElement('script')
                script.src = 'https://cdn.jsdelivr.net/gh/tengbao/vanta/dist/vanta.clouds.min.js'
                script.onload = () => resolve(true)
                document.body.appendChild(script)
            })
        }

        const initVanta = async () => {
            await loadScripts()
            if (!vantaEffect && vantaRef.current && window.VANTA) {
                setVantaEffect(
                    window.VANTA.CLOUDS({
                        el: vantaRef.current,
                        THREE: THREE,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.0,
                        minWidth: 200.0,
                        backgroundColor: 0x111111,
                        skyColor: 0x111111,
                        cloudColor: 0x222222,
                        cloudShadowColor: 0x0,
                        sunColor: 0x333333,
                        sunGlareColor: 0x222222,
                        sunlightColor: 0x222222,
                    })
                )
            }
        }

        initVanta()

        return () => {
            if (vantaEffect) (vantaEffect as any).destroy()
        }
    }, [vantaEffect])

    return (
        <div
            ref={vantaRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0 }}
        />
    )
}
