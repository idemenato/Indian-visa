import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Globe, ChevronDown, ChevronUp, FileText, AlertCircle, Stethoscope, Briefcase } from 'lucide-react';

const visaCategories = [
  {
    id: 'tourist30',
    name: 'e-Tourist Visa (30 Days)',
    icon: Globe,
    stay: '30 Days',
    entry: 'Double Entry',
    description: 'Perfect for short trips, yoga retreats, or visiting friends.',
    featured: true,
  },
  {
    id: 'tourist1y',
    name: 'e-Tourist Visa (1 Year)',
    icon: Globe,
    stay: '90 Days per visit',
    entry: 'Multiple Entry',
    description: 'Ideal for those planning multiple trips within a year.',
    featured: false,
  },
  {
    id: 'tourist5y',
    name: 'e-Tourist Visa (5 Years)',
    icon: Globe,
    stay: '90 Days per visit',
    entry: 'Multiple Entry',
    description: 'The best value for frequent travelers to India.',
    featured: false,
  },
  {
    id: 'business',
    name: 'e-Business Visa',
    icon: Briefcase,
    stay: '180 Days',
    entry: 'Multiple Entry',
    description: 'For meetings, sales, or exploring business opportunities.',
    featured: false,
  },
  {
    id: 'medical',
    name: 'e-Medical Visa',
    icon: Stethoscope,
    stay: '60 Days',
    entry: 'Triple Entry',
    description: 'For medical treatment at recognized hospitals in India. Extendable up to 6 months.',
    featured: false,
  },
];

const requirements = [
  'Passport valid for at least 6 months from the date of arrival in India.',
  'Passport must have at least two blank pages for stamping by the Immigration Officer.',
  'International travelers should have a return ticket or onward journey ticket.',
  'Apply at least 4 days in advance of the date of arrival.',
];

const importantInfo = [
  'The e-Visa is not valid for visiting Protected/Restricted and Cantonment Areas.',
  'Travelers must carry a copy of their Electronic Travel Authorization (ETA) at all times during their stay.',
  'Biometric details of the applicant will be mandatorily captured at immigration on arrival in India.',
  'The e-Visa is non-extendable and non-convertible.',
  "Applicants must ensure their passport is not a Diplomatic/Official passport or Laissez-passer.",
];

const faqs = [
  {
    q: 'How long does it take to process an Indian e-Visa?',
    a: 'Standard processing usually takes 3-5 business days. However, we recommend applying at least 7-10 days before your departure to account for any government delays or additional information requests.',
  },
  {
    q: 'What documents do I need for the application?',
    a: "You will need a digital copy of your passport's bio page (valid for at least 6 months), a recent digital passport-sized photograph with a white background, and an email address to receive your visa.",
  },
  {
    q: 'Can I apply for a visa on arrival in India?',
    a: 'No, the e-Visa must be applied for and approved online before you travel. You must carry a printed copy of your Electronic Travel Authorization (ETA) with you to the airport.',
  },
  {
    q: 'Is my e-Visa valid for all entry points in India?',
    a: 'The e-Visa is valid for entry through 31 designated International Airports and 5 designated Seaports. However, you can exit from any of the authorized Immigration Check Posts (ICPs) in India.',
  },
  {
    q: 'What if my application is rejected?',
    a: 'Government fees are non-refundable even if the visa is rejected. This is why our expert review service is so valuable - we ensure your application meets all requirements before submission to minimize the risk of rejection.',
  },
];

const TravelVisas: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gray-900 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Indian Travel Visas</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-base">
          Everything you need to know about the legal requirements and application process for your journey to India.
        </p>
      </div>

      {/* Visa Categories */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Available e-Visa Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {visaCategories.map((v) => (
            <div
              key={v.id}
              className={`rounded-xl border p-5 flex flex-col gap-2 transition-shadow hover:shadow-md ${v.featured ? 'border-orange-400 shadow-md bg-white' : 'border-gray-200 bg-white'}`}
            >
              <p className={`font-bold text-base ${v.featured ? 'text-orange-600' : 'text-gray-900'}`}>{v.name}</p>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>Stay: {v.stay}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Globe className="h-3 w-3 flex-shrink-0" />
                <span>Entry: {v.entry}</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements + Important Info */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Mandatory Requirements */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Mandatory Requirements</h2>
            <div className="flex flex-col gap-3">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                  <FileText className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-sm">{req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Important Information</h3>
            <ul className="space-y-2">
              {importantInfo.map((info, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="text-orange-500 font-bold mt-0.5">&#8226;</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-orange-400 text-orange-500 font-bold text-xl mb-4">?</div>
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-2">Everything you need to know about the Indian e-Visa process.</p>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-gray-900 text-base">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                }
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 py-14 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Don't let paperwork stop your journey.</h2>
        <p className="text-gray-400 mb-8">Our experts are ready to review your application and ensure a smooth entry into India.</p>
        <Link
          to="/apply"
          className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-all shadow-md"
        >
          Start Your Application
        </Link>
      </div>

    </div>
  );
};

export default TravelVisas;
