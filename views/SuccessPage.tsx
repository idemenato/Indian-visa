import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Mail, Clock, ArrowRight, FileText } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSessionId(params.get('session_id'));
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-6 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Your Indian e-Visa application has been submitted and payment confirmed.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 text-left space-y-5">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
              <Mail className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Confirmation email sent</p>
              <p className="text-sm text-gray-500">Check your inbox for application details and next steps. If you don't see it, check your spam folder.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Expert review in progress</p>
              <p className="text-sm text-gray-500">Our team will carefully review your application for completeness and accuracy before submission.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">e-Visa delivered within 24Ã¢ÂÂ72 hours</p>
              <p className="text-sm text-gray-500">Your approved e-Visa will be sent to the email address you provided. Processing times depend on the Indian government portal.</p>
            </div>
          </div>
        </div>

        {sessionId && (
          <p className="text-xs text-gray-400 mb-6">
            Payment reference: <span className="font-mono">{sessionId}</span>
          </p>
        )}

        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-all shadow-md"
        >
          <span>Back to Home</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          Questions? Contact us at{' '}
          <a href="mailto:info@indiagovisa.com" className="text-orange-600 hover:underline">
            info@indiagovisa.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
