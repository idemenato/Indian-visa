import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Clock, CheckCircle2, Star, Quote, Camera } from 'lucide-react';


const ReviewsCarousel: React.FC = () => {
  const reviews = [
    { text: "They caught a typo in my passport number that would have cost me my trip. Truly professional service!", author: "Sarah M., United Kingdom" },
    { text: "My visa application was rejected without explanation, so I turned to Indiagovisa, and they helped me get the visa on the first try, completely stress-free. Thank you guys!", author: "Luís F., Spain" },
    { text: "I wasn't sure how to upload my photos in the required format, so I decided to let the professionals handle it. By the end of the same day, everything was done and my visa application was submitted.", author: "Lucia S., Slovakia" },
    { text: "Indiagovisa saved me hours of time! The official website kept crashing no matter what I tried. Here, I got it done in just a few minutes without any issues. Great experience - I'll gladly use your service again!", author: "Adamo K., Italy" }
  ];
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const extended = [...reviews, reviews[0]];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (current === reviews.length) {
      const reset = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(0);
      }, 700);
      return () => clearTimeout(reset);
    } else {
      setIsTransitioning(true);
    }
  }, [current, reviews.length]);

  const dotIndex = current % reviews.length;

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: isTransitioning ? 'transform 0.7s ease-in-out' : 'none'
        }}
      >
        {extended.map((r, i) => (
          <div key={i} className="min-w-full px-4 text-center flex-shrink-0">
            <div className="flex justify-center space-x-1 mb-6">
              {[1,2,3,4,5].map(s => <Star key={s} className="h-6 w-6 text-yellow-400 fill-current" />)}
            </div>
            <p className="text-2xl font-bold mb-8 italic text-gray-700 max-w-3xl mx-auto">"{r.text}"</p>
            <p className="font-bold text-gray-500">— {r.author}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-2 mt-8">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIsTransitioning(true); setCurrent(i); }}
            className={`h-3 rounded-full transition-all ${i === dotIndex ? 'bg-orange-600 w-6' : 'bg-gray-300 w-3'}`}
          />
        ))}
      </div>
    </div>
  );
};


const LandingPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.jpg" 
            alt="Taj Mahal" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{fontFamily: "'Playfair Display', serif"}}>
              Your Journey to India <br/><span className="text-orange-500">Starts Simplified.</span>
            </h1>
            <p className="text-xl mb-10 text-white leading-relaxed">
              Don't struggle with complex government forms. We handle the paperwork, validation, and submission for you. 99% approval rate.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/apply" 
                className="bg-orange-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-orange-700 transition-all text-center shadow-xl transform hover:-translate-y-1"
              >
                Apply for eVisa Now
              </Link>
              <a 
                href="#benefits" 
                className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all text-center"
              >
                How it Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="benefits" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{fontFamily: "'Playfair Display', serif"}}>Why Choose IndiaGoVisa.com?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The official portal can be confusing and often rejects applications for minor errors. We ensure perfection from start to finish.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <ShieldCheck className="h-10 w-10 text-orange-600" />, title: "Error-Free Submission", desc: "Our experts review every detail of your application before it hits the government server." },
              { icon: <Camera className="h-10 w-10 text-orange-600" />, title: "We handle the photo format", desc: "Photos will be reviewed by our experts. Don't worry if they're not perfect, we'll help you fix any issues before submission." },
              { icon: <Zap className="h-10 w-10 text-orange-600" />, title: "Simplified Form", desc: "We translated the 8-page government form into a clean, 5-minute experience." }
            ].map((benefit, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-gray-50 hover:bg-orange-50 transition-colors border border-gray-100">
                <div className="mb-6">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Story */}
      <section className="py-24 bg-orange-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-700/20 skew-x-12 transform translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/traveler/600/800" 
                  alt="Founder" 
                  className="rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                  <Quote className="h-8 w-8 text-orange-600 mb-2" />
                  <p className="text-gray-800 font-bold">"Made by a traveler, for travelers."</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 italic" style={{fontFamily: "'Playfair Display', serif"}}>"I've been in your shoes..."</h2>
              <p className="text-xl mb-6 text-orange-100 leading-relaxed">
                Hi, I'm Daniela. When I first planned my trip to India from Europe, I spent six hours trying to navigate the official visa website. It crashed every few minutes, saved nothing, rejected my photos without explanation, and left me feeling anxious about my entire trip.
              </p>
              <p className="text-xl mb-10 text-orange-100 leading-relaxed">
                I realized that travelers need a bridge. That's why I started IndiaGoVisa.com. We are based in the EU but work with experts globally to ensure your Indian adventure starts with excitement, not paperwork stress.
              </p>
              <div className="flex items-center space-x-4">
                <div className="h-1 w-20 bg-orange-400"></div>
                <span className="font-bold tracking-widest uppercase">Daniela - Founder & CEO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{fontFamily: "'Playfair Display', serif"}}>Simple, Transparent Pricing</h2>
            <p className="text-gray-600 text-lg">No hidden costs. One flat service fee + official government fee.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { type: "30-Day Tourist", govFee: "$25", serviceFee: "$69", features: ["30 days validity", "Double entry", "24/7 Support", "Photo editing included"] },
              { type: "1-Year Tourist", govFee: "$40", serviceFee: "$69", recommended: true, features: ["365 days validity", "Multiple entry", "24/7 Support", "Photo editing included"] },
              { type: "5-Year Tourist", govFee: "$160/$200/$484", serviceFee: "$69", features: ["5 years validity", "Multiple entry", "24/7 Support", "Photo editing included"] }
            ].map((plan, idx) => (
              <div key={idx} className={`bg-white p-10 rounded-3xl shadow-lg border-2 ${(plan as any).recommended ? 'border-orange-600' : 'border-transparent'} relative`}>
                {(plan as any).recommended && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.type}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.serviceFee}</span>
                  <span className="text-gray-500"> service fee</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    Gov Fee: {plan.govFee}
                  </li>
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/apply" 
                  className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${(plan as any).recommended ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  Choose {plan.type}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center" style={{fontFamily: "'Playfair Display', serif"}}>What Our Customers Say</h2>
          <ReviewsCarousel />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
