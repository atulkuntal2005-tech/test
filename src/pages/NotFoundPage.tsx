import React from 'react';
import { Link } from '../context/RouterContext.tsx';
import { ArrowLeft, Home, FileQuestion } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-amber-600 tracking-wider uppercase">
            Error 404 · Page Not Found
          </span>
          <h1 className="text-3xl font-bold text-navy-950 font-display">
            The page you requested does not exist
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The URL may have been mistyped or moved. Please explore the main sections of Shri Goyal Associates below.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-navy-900 font-semibold text-xs transition-colors"
          >
            <span>Browse Services</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
          Shri Goyal Associates · Mandi Choraha, near Narsi Vihar, Mathura (281004)
        </div>
      </div>
    </div>
  );
};
