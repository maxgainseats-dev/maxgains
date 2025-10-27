import type React from "react"

type HeroSectionProps = {
  promoText?: string
  headingTop?: React.ReactNode
  headingHighlight?: React.ReactNode
  description?: string
}

export default function HeroSection({
  promoText = "Save up to 60% on delivery",
  headingTop = (
    <>
      Slash Your Food
      <br />
    </>
  ),
  headingHighlight = (
    <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
      Delivery Costs
    </span>
  ),
  description = "Get huge savings on Uber Eats group orders—wholesale prices, zero hassle.",
}: HeroSectionProps) {
  return (
    <section className="relative pb-24 lg:py-24  px-2 sm:px-4 lg:px-6">
      {/* Main Heading */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-12">
          {/* Promo Badge */}
        

          {/* Main Heading */}
          <div className="space-y-8">
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-tight tracking-tight">
              {headingTop}
              {headingHighlight}
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-300 leading-relaxed max-w-3xl font-medium">{description}</p>
          </div>

          {/* Trust Indicators
<div className="grid grid-cols-2 gap-4 pt-0 w-full max-w-md mx-auto">
  <div className="flex items-center space-x-3 bg-green-500/20 backdrop-blur-xl border border-green-500/30 px-6 py-3 rounded-full">
    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-500/50"></div>
    <span className="text-green-300 font-bold">Trusted </span>
  </div>

  <div className="flex items-center space-x-3 bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 px-6 py-3 rounded-full">
    <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-lg shadow-blue-500/50"></div>
    <span className="text-blue-300 font-bold">Reliable</span>
  </div>

  <div className="flex items-center space-x-3 bg-purple-500/20 backdrop-blur-xl border border-purple-500/30 px-6 py-3 rounded-full">
    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg shadow-purple-500/50"></div>
    <span className="text-purple-300 font-bold">24/7</span>
  </div>

  <div className="flex items-center space-x-3 bg-yellow-500/20 backdrop-blur-xl border border-yellow-500/30 px-6 py-3 rounded-full">
    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
    <span className="text-yellow-300 font-bold">Safe</span>
  </div>
</div> */}



        </div>
      </div>
    </section>
  )
}
