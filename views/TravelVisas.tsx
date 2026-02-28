import { useState } from "react";
import { Clock, Users, Globe, Briefcase, Heart, ChevronDown, ChevronUp, FileText, AlertCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const visaCategories = [
  { id: 1, title: "e-Tourist Visa (30 Days)", stay: "30 Days", entry: "Double Entry", description: "Perfect for short trips, yoga retreats, or visiting friends." },
  { id: 2, title: "e-Tourist Visa (1 Year)", stay: "90 Days per visit", entry: "Multiple Entry", description: "Ideal for those planning multiple trips within a year." },
  { id: 3, title: "e-Tourist Visa (5 Years)", stay: "90 Days per visit", entry: "Multiple Entry", description: "The best value for frequent travelers to India." },
  { id: 4, title: "e-Business Visa", stay: "180 Days", entry: "Multiple Entry", description: "For meetings, sales, or exploring business opportunities." },
  { id: 5, title: "e-Medical Visa", stay: "60 Days", entry: "Triple Entry", description: "For patients seeking medical treatment at recognized hospitals in India. Can be extended up to 6 months." },
];

const requirements = [
  { icon: FileText, text: "Passport valid for at least 6 months from the date of arrival in India." },
  { icon: Globe, text: "Passport must have at least two blank pages for stamping by the Immigration Officer." },
  { icon: AlertCircle, text: "International travelers should have a return ticket or onward journey ticket." },
  { icon: Clock, text: "Apply at least 4 days in advance of the date of arrival." },
];

const importantInfo = [
  "The e-Visa is not valid for visiting Protected/Restricted and Cantonment Areas.",
  "Travelers must carry a copy of their Electronic Travel Authorization (ETA) at all times during their stay.",
  "Biometric details of the applicant will be mandatorily captured at immigration on arrival in India.",
  "The e-Visa is non-extendable and non-convertible.",
  "Applicants must ensure their passport is not a Diplomatic/Official passport or Laissez-passer.",
];

const faqs = [
  { question: "How long does it take to process an Indian e-Visa?", answer: "Standard processing usually takes 3-5 business days. However, we recommend applying at least 7-10 days before your departure to account for any government delays or additional information requests." },
  { question: "What documents do I need for the application?", answer: "You will need a valid passport with at least 6 months validity and 2 blank pages, a recent passport-sized photograph (white background, face clearly visible), a scanned copy of the first and last page of your passport, a valid email address, and a credit/debit card for payment." },
  { question: "Can I apply for a visa on arrival in India?", answer: "India does not offer a traditional Visa on Arrival for most nationalities. The e-Visa must be obtained online before traveling. However, citizens of a few select countries may be eligible for a Visa on Arrival at specific airports." },
  { question: "Is my e-Visa valid for all entry points in India?", answer: "The e-Visa is valid for entry through 31 designated International Airports and 5 designated Seaports. However, you can exit from any of the authorized Immigration Check Posts (ICPs) in India." },
  { question: "What if my application is rejected?", answer: "If your e-Visa application is rejected, the Indian government does not provide a specific reason for rejection. You may reapply after a certain period. Our service fee is non-refundable, but we will guide you through the reapplication process at no extra charge." },
];

export default function TravelVisas() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => { setOpenFaq(openFaq === index ? null : index); };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0f1f3d] text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Indian Travel Visas</h1>
        <p className="text-gray-300 max-w-xl mx-auto text-base">Everything you need to know about the legal requirements and application process for your journey to India.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-[#0f1f3d] mb-10">Available e-Visa Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {visaCategories.map((visa, index) => (
            <div key={index} className="group border border-gray-200 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-orange-400 hover:shadow-lg">
              <h3 className="font-semibold text-[#0f1f3d] mb-3 text-sm group-hover:text-orange-500 transition-colors duration-200">{visa.title}</h3>
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-1"><Clock className="w-3 h-3" /><span>Stay: {visa.stay}</span></div>
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-3"><Users className="w-3 h-3" /><span>Entry: {visa.entry}</span></div>
              <p className="text-gray-500 text-xs leading-relaxed">{visa.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold text-[#0f1f3d] mb-6">Mandatory Requirements</h2>
            <div className="space-y-3">
              {requirements.map((req, i) => { const Icon = req.icon; return (
                <div key={i} className="bg-white rounded-lg p-4 flex items-start gap-3 shadow-sm">
                  <Icon className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                  <p className="text-gray-600 text-sm">{req.text}</p>
                </div>
              ); })}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-7">
            <h3 className="text-lg font-bold text-[#0f1f3d] mb-5">Important Information</h3>
            <ul className="space-y-3">
              {importantInfo.map((info, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-orange-400 text-orange-400 text-xl font-bold mb-4">?</div>
          <h2 className="text-3xl font-bold text-[#0f1f3d]">Frequently Asked Questions</h2>
          <p className="text-gray-400 mt-2 text-sm">Everything you need to know about the Indian e-Visa process.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between px-6 py-5 text-left" onClick={() => toggleFaq(index)}>
                <span className="font-semibold text-[#0f1f3d] text-sm">{faq.question}</span>
                {openFaq === index ? <ChevronUp className="w-5 h-5 text-orange-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5"><p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0f1f3d] text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-3">Don&apos;t let paperwork stop your journey.</h2>
        <p className="text-gray-300 mb-8 text-sm">Our experts are ready to review your application and ensure a smooth entry into India.</p>
        <Link to="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors">Start Your Application</Link>
      </div>
    </div>
  );
}
