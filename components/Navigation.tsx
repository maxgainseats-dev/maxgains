"use client";
import Link from "next/link";

type User = {
  name: string;
  avatar?: string;
};

type NavigationProps = {
  user: User | null;
  setShowAuthModal: (show: boolean) => void;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  openFAQModal: () => void;
  handleLogout: () => void;
  setViewMode: (mode: "orderForm" | "orderHistory") => void | Promise<void>;
};

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
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b-2 border-primary/30 glow-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            onClick={() => setViewMode("orderForm")}
            className="cursor-pointer text-2xl font-black gradient-orange-glow bg-clip-text text-transparent"
          >
            MaxGains
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() =>
                window.open(
                  "https://vimeo.com/1131848073?share=copy&fl=sv&fe=ci",
                  "_blank"
                )
              }
              className="text-gray-300 hover:text-primary font-medium transition-colors duration-200"
            >
              How to Order
            </button>

            <button
              onClick={openFAQModal}
              className="text-gray-300 hover:text-primary font-medium transition-colors duration-200"
            >
              FAQ
            </button>
            <a
              href="https://discord.gg/aJzbRnPAP4"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-primary font-medium transition-colors duration-200"
            >
              Support
            </a>
            {user ? (
              <>
                <button
                  onClick={() => setViewMode("orderHistory")}
                  className="text-gray-300 hover:text-primary font-medium transition-colors duration-200"
                >
                  My Orders
                </button>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-black/50 rounded-lg border border-primary/30">
                    <img
                      src={
                        user.avatar ||
                        "https://img.freepik.com/free-vector/hand-drawn-burger-cartoon-illustration_23-2150622707.jpg?semt=ais_hybrid&w=740&q=80" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-white">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-primary/30 rounded-lg hover:bg-primary/10 transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 gradient-orange-glow text-white font-bold rounded-full transition-all duration-200 hover:scale-105 glow-orange"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <span className="w-full h-0.5 bg-primary rounded-full"></span>
              <span className="w-full h-0.5 bg-primary rounded-full"></span>
              <span className="w-full h-0.5 bg-primary rounded-full"></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-primary/30">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() =>
                  window.open(
                    "https://vimeo.com/1131848073?share=copy&fl=sv&fe=ci",
                    "_blank"
                  )
                }
                className="text-left text-gray-300 hover:text-primary font-medium py-3 transition-colors"
              >
                How to Order
              </button>
              <button
                onClick={openFAQModal}
                className="text-left text-gray-300 hover:text-primary font-medium py-3 transition-colors"
              >
                FAQ
              </button>
              <a
                href="https://discord.gg/aJzbRnPAP4"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-primary font-medium py-3 transition-colors"
              >
                Support
              </a>
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setViewMode("orderHistory");
                      toggleMobileMenu();
                    }}
                    className="text-left text-gray-300 hover:text-primary font-medium py-3 transition-colors"
                  >
                    My Orders
                  </button>
                  <div className="flex flex-col space-y-4 pt-2">
                    <button
                      onClick={handleLogout}
                      className="text-left text-gray-300 hover:text-primary font-medium py-3 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    toggleMobileMenu();
                  }}
                  className="px-6 py-2 gradient-orange-glow text-white font-bold rounded-full transition-all duration-200 w-full glow-orange"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
