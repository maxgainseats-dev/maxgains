import type React from "react"

type Feature = {
  icon: React.ReactNode
  title: string
  description: string
}

type FeaturesProps = {
  features?: Feature[]
}

const defaultFeatures: Feature[] = [
  {
    icon: (
      <div className="w-16 h-16 gradient-orange-glow rounded-2xl flex items-center justify-center glow-orange group-hover:glow-orange-strong transition-all duration-300">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      </div>
    ),
    title: "Massive Savings",
    description: "Save up to 60% on delivery fees and service charges with our premium optimization",
  },
  {
    icon: (
      <div className="w-16 h-16 gradient-orange-glow rounded-2xl flex items-center justify-center glow-orange group-hover:glow-orange-strong transition-all duration-300">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    ),
    title: "Lightning Fast",
    description: "Get your discounted link in minutes with our automated processing system",
  },
  {
    icon: (
      <div className="w-16 h-16 gradient-orange-glow rounded-2xl flex items-center justify-center glow-orange group-hover:glow-orange-strong transition-all duration-300">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
    ),
    title: "100% Secure",
    description: "Enterprise-grade security ensures your payment and personal data are always protected",
  },
]

export default function Features({ features = defaultFeatures }: FeaturesProps) {
  return (
    <section className="py-18 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto"> {/* 👈 centered container */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-black gradient-orange-glow bg-clip-text text-transparent mb-6 text-glow-orange">
            Why Choose MaxGains?
          </h2>
          <p className="text-xl lg:text-2xl text-gray-300 font-medium mb-12">
            The smartest way to save on food delivery
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-black gradient-orange-glow bg-clip-text text-transparent mb-2 text-glow-orange">
                60%
              </div>
              <div className="text-gray-400 font-medium">Average Savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black gradient-orange-glow bg-clip-text text-transparent mb-2 text-glow-orange">
                10K+
              </div>
              <div className="text-gray-400 font-medium">Orders Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black gradient-orange-glow bg-clip-text text-transparent mb-2 text-glow-orange">
                4.9★
              </div>
              <div className="text-gray-400 font-medium">Customer Rating</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-black border-2 border-primary/30 rounded-2xl p-8 text-center hover:border-primary transition-all duration-300 group hover:scale-105 glow-orange"
              >
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
