import type React from "react"

type HeroSectionProps = {
  promoText?: string
  headingTop?: React.ReactNode
  headingHighlight?: React.ReactNode
  description?: string
}

export default function HeroSection({
  promoText = "Save up to 60% on delivery",
  headingTop = "SAVE ",
  headingHighlight = "BIG",
  description = "We help you slash prices on every meal while supporting local restaurants. No subscription fees, just pure savings.",
}: HeroSectionProps) {
  return (
    <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <div className="gradient-orange-glow text-white px-6 py-3 rounded-full text-center mb-8 inline-block font-bold glow-orange">
            {promoText}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-none tracking-tight mb-8">
            {headingTop}
            <span className="gradient-orange-glow bg-clip-text text-transparent text-glow-orange">
              {headingHighlight}
            </span>{" "}
            ON <span className="gradient-orange-glow bg-clip-text text-transparent text-glow-orange">EVERY</span>
            <br />
            FOOD DELIVERY
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">{description}</p>

<button className="gradient-orange-glow text-white font-black text-lg px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 glow-orange-soft">
  PLACE ORDER NOW
</button>
        </div>
      </div>
    </section>
  )
}
