import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import VisaForm from './views/VisaForm';
import SuccessPage from './views/SuccessPage';
import { Plane, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="flex items-center space-x-2">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-700 bg-clip-text text-transparent">IndiaGoVisa.com</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-orange-600 font-medium">Home</Link>
            <a href="#pricing" className="text-gray-600 hover:text-orange-600 font-medium">Travel Visas</a>
            <a href="#benefits" className="text-gray-600 hover:text-orange-600 font-medium">Why Us</a>
            <Link 
              to="/apply" 
              className="bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-700 transition-all shadow-md hover:shadow-lg"
            >
              Apply Now
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-4 absolute w-full shadow-lg">
          <Link to="/" className="block text-gray-600 font-medium" onClick={() => setIsOpen(false)}>Home</Link>
          <a href="#pricing" className="block text-gray-600 font-medium" onClick={() => setIsOpen(false)}>Travel Visas</a>
          <a href="#benefits" className="block text-gray-600 font-medium" onClick={() => setIsOpen(false)}>Why Us</a>
          <Link 
            to="/apply" 
            className="block bg-orange-600 text-white px-6 py-3 rounded-xl text-center font-bold"
            onClick={() => setIsOpen(false)}
          >
            Apply Online
          </Link>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <Plane className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-white">IndiaGoVisa.com</span>
          </div>
          <p className="max-w-md text-gray-400 leading-relaxed mb-6">
            We are a dedicated visa consultancy service helping travelers worldwide experience the magic of India. Our mission is to replace governmental complexity with simple, human-centered service. We have no control over how quickly applications are processed. The official website is exclusively <a href="https://indianvisaonline.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-orange-400 hover:text-orange-300">indianvisaonline.gov.in</a>. Do not trust sites that promise faster processing for an extra fee.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Services</h4>
          <ul className="space-y-4">
            <li>e-Tourist Visa (30 Days)</li>
            <li>e-Tourist Visa (1 Year)</li>
            <li>e-Tourist Visa (5 Years)</li>
            <li>e-Business Visa</li>
            <li>e-Medical Visa</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Support</h4>
          <ul className="space-y-4">
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} IndiaGoVisa.com - Private Agency (Not affiliated with the Indian Government).</p>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/apply" element={<VisaForm />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
