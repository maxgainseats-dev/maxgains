import type React from "react"

type Step = {
  icon: React.ReactNode
  title: string
  description: string
}

type HowItWorksProps = {
  steps?: Step[]
}

const defaultSteps: Step[] = [
  {
    icon: (
      <div className="w-20 h-20 gradient-orange-glow rounded-3xl flex items-center justify-center glow-orange group-hover:glow-orange-strong transition-all duration-300">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
    ),
    title: "Paste Your Link",
    description: "Share your Uber Eats group order link with our secure processing system",
  },
  {
    icon: (
      <div className="w-20 h-20 gradient-orange-glow rounded-3xl flex items-center justify-center glow-orange group-hover:glow-orange-strong transition-all duration-300">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
    ),
    title: "Get Your Quote",
    description: "Receive your personalized discount quote instantly through our chat system",
  },
  {
    icon: (
      <div className="w-20 h-20 gradient-orange-glow rounded-3xl flex items-center justify-center glow-orange group-hover:glow-orange-strong transition-all duration-300">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    ),
    title: "Save Big",
    description: "Pay significantly less and enjoy your favorite food with maximum savings",
  },
]

export default function HowItWorks({ steps = defaultSteps }: HowItWorksProps) {
  return (
    <section className="py-18 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto"> {/* 👈 center container */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-black gradient-orange-glow bg-clip-text text-transparent mb-6 text-glow-orange">
            How It Works
          </h2>
          <p className="text-xl text-gray-200 font-medium">
            Three simple steps to massive savings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* connecting line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-1 gradient-orange-glow rounded-full glow-orange"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-black border-2 border-primary/30 rounded-2xl p-8 text-center relative group hover:border-primary transition-all duration-300 hover:scale-105 glow-orange"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 gradient-orange-glow text-white rounded-full flex items-center justify-center text-lg font-bold glow-orange">
                {idx + 1}
              </div>

              <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-200 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
