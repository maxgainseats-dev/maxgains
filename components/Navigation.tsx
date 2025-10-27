"use client"

type User = {
  name: string
  avatar?: string
}

type NavigationProps = {
  user: User | null
  setShowAuthModal: (show: boolean) => void
  mobileMenuOpen: boolean
  toggleMobileMenu: () => void
  openFAQModal: () => void
  handleLogout: () => void
  setViewMode: (mode: "orderForm" | "orderHistory") => void | Promise<void>
}

export default function Navigation({
  user,
  setShowAuthModal,
  mobileMenuOpen,
  toggleMobileMenu,
  openFAQModal,
  handleLogout,
  setViewMode,
}: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-orange-500/20 shadow-lg shadow-orange-500/10">
      <div className="section-container">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              GrubSlash
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={openFAQModal}
              className="text-gray-300 hover:text-red-400 font-medium transition-all duration-200 hover:scale-105"
            >
              FAQ
            </button>
            <a
              href="https://discord.gg/bmBxFcrjgG"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-pink-400 font-medium transition-all duration-200 hover:scale-105"
            >
              Support
            </a>
            {user ? (
              <>
                <button
                  onClick={() => setViewMode("orderHistory")}
                  className="text-gray-300 hover:text-red-400 font-medium transition-all duration-200 hover:scale-105"
                >
                  My Orders
                </button>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-black/80 rounded-lg">
                    <img
                      src={
                        user.avatar ||
                        "https://img.freepik.com/free-vector/hand-drawn-burger-cartoon-illustration_23-2150622707.jpg?semt=ais_hybrid&w=740&q=80" ||
                        "/placeholder.svg"
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-red-500/50"
                    />
                    <span className="text-sm font-medium text-white">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-pink-400 border border-gray-600 rounded-lg hover:bg-gray-800/50 hover:border-pink-500/50 transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:via-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-black/80 transition-colors duration-200"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <span className="w-full h-0.5 bg-red-500 rounded-full"></span>
              <span className="w-full h-0.5 bg-red-500 rounded-full"></span>
              <span className="w-full h-0.5 bg-red-500 rounded-full"></span>
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-orange-500/20 bg-black/95">
            <div className="flex flex-col space-y-4">
              <button
                onClick={openFAQModal}
                className="text-left text-gray-300 hover:text-red-400 font-medium py-3 transition-colors duration-200"
              >
                FAQ
              </button>
              <a
                href="https://discord.gg/bmBxFcrjgG"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-pink-400 font-medium py-3 transition-colors duration-200"
              >
                Support
              </a>
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setViewMode("orderHistory")
                      toggleMobileMenu()
                    }}
                    className="text-left text-gray-300 hover:text-red-400 font-medium py-3 transition-colors duration-200"
                  >
                    My Orders
                  </button>
                  <div className="flex flex-col space-y-4 pt-2">
                    <div className="flex items-center space-x-3 p-3 bg-black/80">
                      <img
                        src={user.avatar || "/placeholder.svg?height=32&width=32"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-red-500/50"
                      />
                      <span className="text-sm font-medium text-white">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-left text-gray-300 hover:text-pink-400 font-medium py-3 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true)
                    toggleMobileMenu()
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:via-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-orange-500/30 w-full justify-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
