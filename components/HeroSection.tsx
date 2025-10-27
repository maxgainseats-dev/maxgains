import type React from "react"

type HeroSectionProps = {
  promoText?: string
  headingTop?: React.ReactNode
  headingHighlight?: React.ReactNode
  description?: string
}

export default function HeroSection({
  promoText = "Save up to 70% on delivery",
  headingTop = "SAVE ",
  headingHighlight = "TO THE MAX",
  description = "We assist you in lowering the cost of each meal while promoting nearby resturants. There are no subscription costs—just savings.",
}: HeroSectionProps) {
  return (
    <section className="relative py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-black">
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
            ON <span className="">EVERY</span>
            <br />
            <span className="gradient-orange-glow bg-clip-text text-transparent text-glow-orange">FOOD DELIVERY</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">{description}</p>


        </div>
      </div>
    </section>
  )
}
