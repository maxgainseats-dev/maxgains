type QuickGuideProps = {
  steps?: string[]
  title?: string
}

const defaultSteps = ["Build your cart on Uber Eats", "Select 'Group Order' option", "Copy and paste the link above"]

export default function QuickGuide({ steps = defaultSteps, title = "Quick Guide" }: QuickGuideProps) {
  return (
    <div className="mt-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg shadow-blue-500/20">
      <h4 className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 text-lg">
        {title}
      </h4>
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center space-x-4 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-200">
              {idx + 1}
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors duration-200 font-medium">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
