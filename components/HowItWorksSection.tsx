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
      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300">
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
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-green-500/30 group-hover:shadow-green-500/50 transition-all duration-300">
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
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
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
    <section className="py-18 px-4 sm:px-4 lg:px-6 bg-black">
      <div className="">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-6 text-balance">
            How It Works
          </h2>
          <p className="text-xl text-gray-200 font-medium">Three simple steps to massive savings</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-1 bg-gradient-to-r from-orange-500/30 via-green-500/50 to-blue-500/30 rounded-full"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/80 border border-neutral-800/50 rounded-2xl p-8 text-center relative group hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg shadow-orange-500/30">
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
