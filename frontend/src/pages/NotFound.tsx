import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Martini } from 'lucide-react';
import { Button } from '../components';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/30">
            <Martini className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[8rem] sm:text-[12rem] font-extrabold leading-none tracking-tighter">
            <span className="bg-gradient-to-br from-primary-600 via-primary-500 to-gold-500 bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </div>

        {/* Message */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Oops! This round went south
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
            Looks like this page took a wrong turn at the blackjack table. Let's get you back in the game.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Quick links:</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/menu" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Browse Menu
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Order History
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/account" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
