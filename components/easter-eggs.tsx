"use client"

import { useEffect, useState } from "react"

export function EasterEggs() {
  const [konamiCode, setKonamiCode] = useState<string[]>([])
  const [showSecret, setShowSecret] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ]

  useEffect(() => {
    // Console messages
    console.log("%c🎉 Welcome to Discord Webhook Messenger!", "color: #5865F2; font-size: 20px; font-weight: bold;")
    console.log("%c🔍 Try typing 'secret' in the message box!", "color: #00D166; font-size: 14px;")
    console.log("%c⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA - Try the Konami Code!", "color: #FEE75C; font-size: 12px;")
    console.log("%c💻 Made with ❤️ by eqwzzx", "color: #EB459E; font-size: 12px;")

    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...konamiCode, event.code].slice(-konamiSequence.length)
      setKonamiCode(newSequence)

      if (JSON.stringify(newSequence) === JSON.stringify(konamiSequence)) {
        triggerKonamiEffect()
        setKonamiCode([])
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [konamiCode])

  const triggerKonamiEffect = () => {
    setShowSecret(true)

    // Create particle effect
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }))
    setParticles(newParticles)

    // Play sound effect (if available)
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
      )
      audio.volume = 0.1
      audio.play().catch(() => {}) // Ignore if audio fails
    } catch (e) {}

    setTimeout(() => {
      setShowSecret(false)
      setParticles([])
    }, 3000)
  }

  // Check for secret commands in message content
  useEffect(() => {
    const checkSecretCommands = (event: Event) => {
      const target = event.target as HTMLTextAreaElement
      if (target.id === "content") {
        const content = target.value.toLowerCase()

        if (content.includes("secret")) {
          console.log(
            "%c🎊 Secret found! You discovered an easter egg!",
            "color: #FF6B6B; font-size: 16px; font-weight: bold;",
          )
          target.style.background = "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)"
          target.style.backgroundSize = "400% 400%"
          target.style.animation = "rainbow 2s ease infinite"

          setTimeout(() => {
            target.style.background = ""
            target.style.animation = ""
          }, 2000)
        }

        if (content.includes("eqwzzx")) {
          console.log("%c👨‍💻 Hello from the creator! Thanks for using my app!", "color: #9B59B6; font-size: 16px;")
          target.style.boxShadow = "0 0 20px #9B59B6"
          setTimeout(() => {
            target.style.boxShadow = ""
          }, 1000)
        }
      }
    }

    document.addEventListener("input", checkSecretCommands)
    return () => document.removeEventListener("input", checkSecretCommands)
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes particle {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        .particle {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #5865F2;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          animation: particle 3s linear forwards;
        }
      `}</style>

      {showSecret && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
            🎉 KONAMI! 🎉
          </div>
        </div>
      )}

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </>
  )
}