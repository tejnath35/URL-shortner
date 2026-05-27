import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8 border border-blue-100 shadow-sm animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              The Ultimate Link Management Tool
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
              Shorten Your Links, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Expand Your Reach
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform long, ugly URLs into short, memorable links in seconds. 
              Generate custom QR codes instantly and share your content everywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all duration-200 shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.5)] transform hover:-translate-y-1 w-full sm:w-auto text-center"
              >
                Get Started for Free
              </Link>
              <Link 
                to="/urls" 
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-semibold text-lg transition-all duration-200 shadow-sm w-full sm:w-auto text-center"
              >
                Shorten a Link
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Powerful features designed to make link management simple and efficient.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-6">
                  🔗
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Shortening</h3>
                <p className="text-slate-600">Convert long URLs into compact, shareable links instantly. No waiting, no hassle.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-6">
                  📱
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">QR Code Generation</h3>
                <p className="text-slate-600">Automatically generate high-quality QR codes for every shortened link. Perfect for print and mobile.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-2xl mb-6">
                  📊
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Simple Management</h3>
                <p className="text-slate-600">Keep all your links organized in one place with our intuitive dashboard and profile management.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>© {new Date().getFullYear()} URL Shortener. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
