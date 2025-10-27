"use client"

type FAQ = {
  question: string
  answer: string
}

type FAQModalProps = {
  visible: boolean
  onClose: () => void
  faqs?: FAQ[]
}

const defaultFAQs: FAQ[] = [
  {
    question: "How do I get my discounted link?",
    answer: "Paste your Uber Eats group order link and click 'Get My Quote.'",
  },
  {
    question: "Is my data safe?",
    answer: "Yes, we use secure protocols and never share your info.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We support E-Transfer, Crypto, Paypal, Cashapp.",
  },
  {
    question: "Who pays for the order",
    answer: "We place the order on behalf of you!",
  },
  {
    question: "Can you talk to the driver for me?",
    answer:
      "Unfortunately we can only see what you can see on the tracking, we have no special powers once it’s placed!",
  },
  {
    question: "What if I can't find my order or it gets cancelled?",
    answer: "Unfortunately this is out of control and we cannot do anything about this.",
  },
]

export default function FAQModal({ visible, onClose, faqs = defaultFAQs }: FAQModalProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800/50 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl shadow-gray-900/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all duration-200 text-gray-300 hover:text-white text-xl hover:scale-105"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-white mb-4 text-center pt-6">
          Frequently Asked Questions
        </h2>

        {/* Scrollable FAQ content */}
        <div className="overflow-y-auto px-8 py-4 space-y-6 scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700 hover:scrollbar-thumb-orange-500/50">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/50 rounded-xl p-6 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
            >
              <h3 className="font-bold text-white mb-3 text-lg">{faq.question}</h3>
              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
