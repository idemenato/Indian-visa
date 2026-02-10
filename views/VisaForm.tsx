
import React, { useState, useCallback } from 'react';
import { VisaApplication, FormStep } from '../types';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Camera, 
  Upload, 
  FileText,
  User,
  Users, // Added missing Users import
  Shield,
  Plane,
  Globe
} from 'lucide-react';

const VisaForm: React.FC = () => {
  const [step, setStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<Partial<VisaApplication>>({
    nationality: '',
    passportType: 'Ordinary Passport',
    visaService: 'e-TOURIST VISA (for 30 Days)',
    anyOtherPassport: 'No'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'passportPhoto' | 'personalPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(prev => (prev < 7 ? (prev + 1) as FormStep : prev));
  const prevStep = () => setStep(prev => (prev > 1 ? (prev - 1) as FormStep : prev));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl">
          <div className="flex justify-center mb-8">
            <div className="bg-green-100 p-6 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6 serif">Application Submitted!</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Thank you, {formData.givenNames}. Your application for an Indian e-Visa has been received. 
            Our experts will now review your data and submit it to the government portal within 24 hours.
          </p>
          <div className="bg-gray-50 p-6 rounded-2xl mb-10 text-left border border-gray-100">
            <h4 className="font-bold mb-4 flex items-center">
              <Info className="h-5 w-5 text-orange-600 mr-2" />
              Next Steps:
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li>1. Review of your documents by our specialists.</li>
              <li>2. We will contact you if any corrections are needed.</li>
              <li>3. Your eVisa will be sent to <strong>{formData.email}</strong> as soon as it's approved.</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.href = '#/'}
            className="bg-orange-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <Globe className="h-6 w-6" />
              <h3 className="text-xl font-bold">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
                <input 
                  type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                  placeholder="e.g. Slovak, British, German" required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Passport Type</label>
                <select name="passportType" value={formData.passportType} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
                  <option>Ordinary Passport</option>
                  <option>Diplomatic Passport</option>
                  <option>Official Passport</option>
                  <option>Service Passport</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Port of Arrival in India</label>
                <input 
                  type="text" name="portOfArrival" value={formData.portOfArrival} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                  placeholder="e.g. Delhi Airport, Mumbai Airport"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Visa Service</label>
                <select name="visaService" value={formData.visaService} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
                  <option>e-TOURIST VISA (for 30 Days)</option>
                  <option>e-TOURIST VISA (for 1 Year)</option>
                  <option>e-TOURIST VISA (for 5 Years)</option>
                  <option>e-BUSINESS VISA</option>
                  <option>e-MEDICAL VISA</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                  placeholder="email@example.com" required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <User className="h-6 w-6" />
              <h3 className="text-xl font-bold">Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Surname (Exactly as in Passport)</label>
                <input 
                  type="text" name="surname" value={formData.surname} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Given Names (Including Middle Name)</label>
                <input 
                  type="text" name="givenNames" value={formData.givenNames} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none">
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Transgender</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input 
                  type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Town/City of Birth</label>
                <input 
                  type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country of Birth</label>
                <input 
                  type="text" name="countryOfBirth" value={formData.countryOfBirth} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Educational Qualification</label>
                <select name="educationalQualification" value={formData.educationalQualification} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none">
                  <option value="">Select Qualification</option>
                  <option>Graduate</option>
                  <option>Post Graduate</option>
                  <option>Matriculation</option>
                  <option>Professional</option>
                  <option>Below Matriculation</option>
                  <option>Illiterate</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <Shield className="h-6 w-6" />
              <h3 className="text-xl font-bold">Passport Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Passport Number</label>
                <input 
                  type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Place of Issue</label>
                <input 
                  type="text" name="placeOfIssue" value={formData.placeOfIssue} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Issue</label>
                <input 
                  type="date" name="dateOfIssue" value={formData.dateOfIssue} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Expiry</label>
                <input 
                  type="date" name="dateOfExpiry" value={formData.dateOfExpiry} onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="flex items-center space-x-2 text-orange-600 mb-4">
              {/* Using Users icon correctly as it is now imported */}
              <Users className="h-6 w-6" />
              <h3 className="text-xl font-bold">Family & Occupation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 font-bold text-gray-500 uppercase text-xs tracking-wider border-b pb-2">Father's Details</div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-gray-200 border" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Nationality</label>
                <input type="text" name="fatherNationality" value={formData.fatherNationality} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-gray-200 border" />
              </div>

              <div className="md:col-span-2 font-bold text-gray-500 uppercase text-xs tracking-wider border-b pb-2 mt-4">Mother's Details</div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mother's Name</label>
                <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-gray-200 border" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mother's Nationality</label>
                <input type="text" name="motherNationality" value={formData.motherNationality} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-gray-200 border" />
              </div>

              <div className="md:col-span-2 font-bold text-gray-500 uppercase text-xs tracking-wider border-b pb-2 mt-4">Occupation</div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-gray-200 border" placeholder="e.g. Engineer, Teacher, Retired" />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <Plane className="h-6 w-6" />
              <h3 className="text-xl font-bold">Travel & References</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Residential Address</label>
                <textarea name="presentAddress" value={formData.presentAddress} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-orange-500" placeholder="Street, City, State, ZIP, Country" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Countries visited in last 10 years</label>
                <input type="text" name="placesVisitedInLast10Years" value={formData.placesVisitedInLast10Years} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-gray-200 border" placeholder="Comma separated list" />
              </div>
              <div className="md:col-span-2 font-bold text-gray-500 uppercase text-xs tracking-wider border-b pb-2 mt-4">Reference in India</div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input type="text" name="referenceInIndia" value={formData.referenceInIndia} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-gray-200 border" placeholder="Hotel name or friend name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address & Phone</label>
                <input type="text" name="referenceAddressIndia" value={formData.referenceAddressIndia} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-gray-200 border" />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <Upload className="h-6 w-6" />
              <h3 className="text-xl font-bold">Document Upload</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Personal Photo */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Recent Photograph (Square, 2x2 inch)</label>
                <div className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${formData.personalPhoto ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-orange-400 bg-gray-50'}`}>
                  {formData.personalPhoto ? (
                    <div className="relative inline-block">
                      <img src={formData.personalPhoto} alt="Personal" className="w-32 h-32 rounded-xl object-cover shadow-lg mx-auto" />
                      <button 
                        onClick={() => setFormData(prev => ({ ...prev, personalPhoto: undefined }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-orange-100 p-4 rounded-full inline-block">
                        <Camera className="h-8 w-8 text-orange-600" />
                      </div>
                      <p className="text-gray-500 text-sm">Upload your face photo</p>
                      <input type="file" onChange={(e) => handleFileUpload(e, 'personalPhoto')} className="hidden" id="photo-upload" accept="image/*" />
                      <label htmlFor="photo-upload" className="inline-block bg-white text-orange-600 border border-orange-600 px-6 py-2 rounded-xl font-bold cursor-pointer hover:bg-orange-50 transition-colors">
                        Select File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Passport Photo */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Passport Bio-Data Page (Scan)</label>
                <div className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${formData.passportPhoto ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-orange-400 bg-gray-50'}`}>
                  {formData.passportPhoto ? (
                    <div className="relative inline-block">
                      <img src={formData.passportPhoto} alt="Passport" className="w-48 h-32 rounded-xl object-cover shadow-lg mx-auto" />
                      <button 
                        onClick={() => setFormData(prev => ({ ...prev, passportPhoto: undefined }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-orange-100 p-4 rounded-full inline-block">
                        <FileText className="h-8 w-8 text-orange-600" />
                      </div>
                      <p className="text-gray-500 text-sm">Upload passport scan</p>
                      <input type="file" onChange={(e) => handleFileUpload(e, 'passportPhoto')} className="hidden" id="passport-upload" accept="image/*,application/pdf" />
                      <label htmlFor="passport-upload" className="inline-block bg-white text-orange-600 border border-orange-600 px-6 py-2 rounded-xl font-bold cursor-pointer hover:bg-orange-50 transition-colors">
                        Select File
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-2xl flex items-start space-x-3 border border-blue-100 mt-6">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Don't worry about dimensions or background color. Our experts will professionally resize and retouch your photos to meet the strict Indian Embassy requirements at no extra cost.
              </p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
             <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-xl font-bold">Review Application</h3>
            </div>
            
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <table className="w-full text-left">
                <tbody>
                  {[
                    ['Full Name', `${formData.givenNames} ${formData.surname}`],
                    ['Nationality', formData.nationality],
                    ['Email', formData.email],
                    ['Passport No', formData.passportNumber],
                    ['Arrival Port', formData.portOfArrival],
                    ['Visa Type', formData.visaService],
                  ].map(([label, val], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold text-gray-500 w-1/3">{label}</td>
                      <td className="px-6 py-4 text-gray-900">{val || 'Not provided'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
                <h4 className="font-bold text-orange-900">Final Confirmation</h4>
              </div>
              <p className="text-orange-800 mb-6 leading-relaxed">
                By submitting, you authorize IndiaVisa.io to process your application and represent you for the Indian e-Visa process. You certify that all provided information is true and correct.
              </p>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="consent" className="h-5 w-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500" required />
                <label htmlFor="consent" className="text-sm text-orange-900 font-medium">I agree to the Terms of Service and Privacy Policy</label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const steps = [
    "Eligibility", 
    "Personal", 
    "Passport", 
    "Background", 
    "Travel", 
    "Documents", 
    "Finish"
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="flex justify-between mb-4">
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col items-center flex-1 z-10 ${i + 1 === step ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${i + 1 === step ? 'bg-orange-600 text-white ring-4 ring-orange-100' : i + 1 < step ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200'}`}>
                  {i + 1 < step ? <CheckCircle className="h-5 w-5" /> : i + 1}
                </div>
                <span className="hidden md:block text-xs font-bold uppercase tracking-tighter">{s}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-0">
            <div 
              className="h-full bg-orange-600 transition-all duration-500" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12">
          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="mt-12 flex justify-between items-center border-t border-gray-100 pt-10">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </button>

              {step < 7 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-orange-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center space-x-2 shadow-lg shadow-orange-100"
                >
                  <span>Continue</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-12 py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center space-x-2 shadow-lg shadow-green-100 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <CheckCircle className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Security Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">99.8% Approval Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Global Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default VisaForm;
