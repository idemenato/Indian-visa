
import React, { useState, useEffect, useCallback } from 'react';
import { VisaApplication, FormStep } from '../types';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Camera, 
  Upload, 
  FileText, 
  User, 
  Users, 
  Shield, 
  Plane, 
  Globe, 
  Info, 
  RefreshCw, 
  AlertCircle, 
  MapPin,
  X,
  Search
} from 'lucide-react';

const NATIONALITIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway",
  "Oman",
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
  "Vanuatu", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

// Mapping of states and union territories from the image to their respective major districts
const INDIA_STATES_DISTRICTS: Record<string, string[]> = {
  "CHANDIGARH": ["CHANDIGARH"],
  "ANDAMAN AND NICOBAR ISLANDS": ["NICOBARS", "NORTH AND MIDDLE ANDAMAN", "SOUTH ANDAMAN"],
  "ANDHRA PRADESH": ["ANANTAPUR", "CHITTOOR", "EAST GODAVARI", "GUNTUR", "KRISHNA", "KURNOOL", "NELLORE", "PRAKASAM", "SREEKAKULAM", "VISAKHAPATNAM", "VIZIANAGARAM", "WEST GODAVARI", "Y.S.R."],
  "ARUNACHAL PRADESH": ["CHANG LANG", "DIBANG VALLEY", "EAST KAMENG", "EAST SIANG", "KURUNG KUMEY", "LOHIT", "LONGDING", "LOWER DIBANG VALLEY", "LOWER SUBANSIRI", "NAMSAI", "PAPUM PARE", "TAWANG", "TIRAP", "UPPER SIANG", "UPPER SUBANSIRI", "WEST KAMENG", "WEST SIANG"],
  "ASSAM": ["BAKSA", "BARPETA", "BONGAIGAON", "CACHAR", "CHIRANG", "DARRANG", "DHEMAJI", "DHUBRI", "DIBRUGARH", "DIMA HASAO", "GOALPARA", "GOLAGHAT", "HAI LAKANDI", "JORHAT", "KAMRUP", "KAMRUP METRO", "KARBI ANGLONG", "KARIMGANJ", "KOKRAJHAR", "LAKHIMPUR", "MORIGAON", "NAGAON", "NALBARI", "SIBSAGAR", "SONITPUR", "TINSUKIA", "UDALGURI"],
  "BIHAR": ["ARARIA", "ARWAL", "AURANGABAD", "BANKA", "BEGUSARAI", "BHAGALPUR", "BHOJPUR", "BUXAR", "DARBHANGA", "EAST CHAMPARAN", "GAYA", "GOPALGANJ", "JAMUI", "JEHANABAD", "KAIMUR", "KATIHAR", "KHAGARIA", "KISHANGANJ", "LAKHISARAI", "MADHEPURA", "MADHUBANI", "MUNGER", "MUZAFFARPUR", "NALANDA", "NAWADA", "PATNA", "PURNEA", "ROHTAS", "SAHARSA", "SAMASTIPUR", "SARAN", "SHEIKHPURA", "SHEOHAR", "SITAMARHI", "SIWAN", "SUPAUL", "VAISHALI", "WEST CHAMPARAN"],
  "CHHATTISGARH": ["BASTAR", "BIJAPUR", "BILASPUR", "DANTEWADA", "DHAMTARI", "DURG", "GARIABAND", "JANJGIR-CHAMPA", "JASHPUR", "KABIRDHAM", "KANKER", "KONDAGAON", "KORBA", "KOREA", "MAHASAMUND", "MUNGELI", "NARAYANPUR", "RAIGARH", "RAIPUR", "RAJNANDGAON", "SUKMA", "SURAJPUR", "SURGUJA"],
  "DELHI": ["CENTRAL DELHI", "EAST DELHI", "NEW DELHI", "NORTH DELHI", "NORTH EAST DELHI", "NORTH WEST DELHI", "SOUTH DELHI", "SOUTH EAST DELHI", "SOUTH WEST DELHI", "WEST DELHI"],
  "GOA": ["NORTH GOA", "SOUTH GOA"],
  "GUJARAT": ["AHMEDABAD", "AMRELI", "ANAND", "ARAVALLI", "BANAS KANTHA", "BHARUCH", "BHAVNAGAR", "BOTAD", "CHHOTA UDEPUR", "DAHOD", "DANG", "DEVBHUMI DWARKA", "GANDHINAGAR", "GIR SOMNATH", "JAMNAGAR", "JUNAGADH", "KACHCHH", "KHEDA", "MAHISAGAR", "MEHSANA", "MORBI", "NARMADA", "NAVSARI", "PANCH MAHALS", "PATAN", "PORBANDAR", "RAJKOT", "SABAR KANTHA", "SURAT", "SURENDRANAGAR", "TAPI", "VADODARA", "VALSAD"],
  "HARYANA": ["AMBALA", "BHIWANI", "FARIDABAD", "FATEHABAD", "GURGAON", "HISAR", "JHAJJAR", "JIND", "KAITHAL", "KARNAL", "KURUKSHETRA", "MAHENDRAGARH", "MEWAT", "PALWAL", "PANCHKULA", "PANIPAT", "REWARI", "ROHTAK", "SIRSA", "SONIPAT", "YAMUNA NAGAR"],
  "HIMACHAL PRADESH": ["BILASPUR", "CHAMBA", "HAMIRPUR", "KANGRA", "KINNAUR", "KULLU", "LAHAUL AND SPITI", "MANDI", "SHIMLA", "SIRMAUR", "SOLAN", "UNA"],
  "JAMMU AND KASHMIR": ["ANANTNAG", "BANDIPORE", "BARAMULLA", "BUDGAM", "DODA", "GANDERBAL", "JAMMU", "KATHUA", "KISHTWAR", "KULGAM", "KUPWARA", "POONCH", "PULWAMA", "RAJOURI", "RAMBAN", "REASI", "SAMBA", "SHOPIAN", "SRINAGAR", "UDHAMPUR"],
  "JHARKHAND": ["BOKARO", "CHATRA", "DEOGHAR", "DHANBAD", "DUMKA", "EAST SINGHBHUM", "GARHWA", "GIRIDIH", "GODDA", "GUMLA", "HAZARIBAG", "JAMTARA", "KHUNTI", "KODERMA", "LATEHAR", "LOHARDAGA", "PAKUR", "PALAMU", "RAMGARH", "RANCHI", "SAHIBGANJ", "SERAIKELA KHARSAWAN", "SIMDEGA", "WEST SINGHBHUM"],
  "KARNATAKA": ["BAGALKOT", "BANGALORE", "BANGALORE RURAL", "BELGAUM", "BELLARY", "BIDAR", "CHAMARAJANAGAR", "CHIKBALLAPUR", "CHIKMAGALUR", "CHITRADURGA", "DAKSHINA KANNADA", "DAVANGERE", "DHARWAD", "GADAG", "GULBARGA", "HASSAN", "HAVERI", "KODAGU", "KOLAR", "KOPPAL", "MANDYA", "MYSORE", "RAICHUR", "RAMANAGARA", "SHIMOGA", "TUMKUR", "UDUPI", "UTTARA KANNADA", "VIJAYAPURA", "YADGIR"],
  "KERALA": ["ALAPPUZHA", "ERNAKULAM", "IDUKKI", "KANNUR", "KASARAGOD", "KOLLAM", "KOTTAYAM", "KOZHIKODE", "MALAPPURAM", "PALAKKAD", "PATHANAMTHITTA", "THIRUVANANTHAPURAM", "THRISSUR", "WAYANAD"],
  "MADHYA PRADESH": ["AGAR MALWA", "ALIRAJPUR", "ANUPPUR", "ASHOKNAGAR", "BALAGHAT", "BARWANI", "BETUL", "BHIND", "BHOPAL", "BURHANPUR", "CHHATARPUR", "CHHINDWARA", "DAMOH", "DATIA", "DEWAS", "DHAR", "DINDORI", "GUNA", "GWALIOR", "HARDA", "HOSHANGABAD", "INDORE", "JABALPUR", "JHABUA", "KATNI", "KHANDWA", "KHARGONE", "MANDLA", "MANDSAUR", "MORENA", "NARSINGHPUR", "NEEMUCH", "PANNA", "RAISEN", "RAJGARH", "RATLAM", "REWA", "SAGAR", "SATNA", "SEHORE", "SEONI", "SHAHDOL", "SHAJAPUR", "SHEOPUR", "SHIVPURI", "SIDHI", "SINGRAULI", "TIKAMGARH", "UJJAIN", "UMARIA", "VIDISHA"],
  "MAHARASHTRA": ["AHMEDNAGAR", "AKOLA", "AMRAVATI", "AURANGABAD", "BEED", "BHANDARA", "BULDHANA", "CHANDRAPUR", "DHULE", "GADCHIROLI", "GONDIA", "HINGOLI", "JALGAON", "JALNA", "KOLHAPUR", "LATUR", "MUMBAI", "MUMBAI CITY", "MUMBAI SUBURBAN", "NAGPUR", "NANDED", "NANDURBAR", "NASHIK", "OSMANABAD", "PALGHAR", "PARBHANI", "PUNE", "RAIGAD", "RATNAGIRI", "SANGLI", "SATARA", "SINDHUDURG", "SOLAPUR", "THANE", "WARDHA", "WASHIM", "YAVATMAL"],
  "MANIPUR": ["BISHNUPUR", "CHANDEL", "CHURACHANDPUR", "IMPHAL EAST", "IMPHAL WEST", "SENAPATI", "TAMENGLONG", "THOUBAL", "UKHRUL"],
  "MEGHALAYA": ["EAST GARO HILLS", "EAST KHASI HILLS", "JAINTIA HILLS", "RI BHOI", "SOUTH GARO HILLS", "WEST GARO HILLS", "WEST KHASI HILLS"],
  "MIZORAM": ["AIZAWL", "CHAMPHAI", "KOLASIB", "LAWNGTLAI", "LUNGLEI", "MAMIT", "SAIHA", "SERCHHIP"],
  "NAGALAND": ["DIMAPUR", "KIPHIRE", "KOHIMA", "LONGLENG", "MOKOKCHUNG", "MON", "PEREN", "PHEK", "TUENSANG", "WOKHA", "ZUNHEBOTO"],
  "ORISSA": ["ANGUL", "BALANGIR", "BALESHWAR", "BARGARH", "BHADRAK", "BOUDH", "CUTTACK", "DEOGARH", "DHENKANAL", "GAJAPATI", "GANJAM", "JAGATSINGHAPUR", "JAJAPUR", "JHARSUGUDA", "KALAHANDI", "KANDHAMAL", "KENDRAPARA", "KENDUJHAR", "KHORDHA", "KORAPUT", "MALKANGIRI", "MAYURBHANJ", "NABARANGPUR", "NAYAGARH", "NUAPADA", "PURI", "RAYAGADA", "SAMBALPUR", "SONEPUR", "SUNDARGARH"],
  "PONDICHERRY": ["KARAIKAL", "MAHE", "PONDICHERRY", "YANAM"],
  "PUNJAB": ["AMRITSAR", "BARNALA", "BATHINDA", "FARIDKOT", "FATEHGARH SAHIB", "FAZILKA", "FEROZEPUR", "GURDASPUR", "HOSHIARPUR", "JALANDHAR", "KAPURTHALA", "LUDHIANA", "MANSA", "MOGA", "MUKTSAR", "PATHANKOT", "PATIALA", "RUPNAGAR", "SANGRUR", "SHAHID BHAGAT SINGH NAGAR", "TARN TARAN"],
  "RAJASTHAN": ["AJMER", "ALWAR", "BANSWARA", "BARAN", "BARMER", "BHARATPUR", "BHILWARA", "BIKANER", "BUNDI", "CHITTORGARH", "CHURU", "DAUSA", "DHOLPUR", "DUNGARPUR", "GANGANAGAR", "HANUMANGARH", "JAIPUR", "JAISALMER", "JALORE", "JHALAWAR", "JHUNJHUNU", "JODHPUR", "KARAULI", "KOTA", "NAGAUR", "PALI", "PRATAPGARH", "RAJSAMAND", "SAWAI MADHOPUR", "SIKAR", "SIROHI", "TONK", "UDAIPUR"],
  "SIKKIM": ["EAST SIKKIM", "NORTH SIKKIM", "SOUTH SIKKIM", "WEST SIKKIM"],
  "TAMIL NADU": ["ARIYALUR", "CHENNAI", "COIMBATORE", "CUDDALORE", "DHARMAPURI", "DINDIGUL", "ERODE", "KANCHIPURAM", "KANNIYAKUMARI", "KARUR", "KRISHNAGIRI", "MADURAI", "NAGAPATTINAM", "NAMAKKAL", "NILGIRIS", "PERAMBALUR", "PUDUKKOTTAI", "RAMANATHAPURAM", "SALEM", "SIVAGANGA", "THANJAVUR", "THENI", "THOOTHUKKUDI", "TIRUCHIRAPPALLI", "TIRUNELVELI", "TIRUPPUR", "TIRUVALLUR", "TIRUVANNAMALAI", "TIRUVARUR", "VELLORE", "VILUPPURAM", "VIRUDHUNAGAR"],
  "TRIPURA": ["DHALAI", "GOMATI", "KHOWAI", "NORTH TRIPURA", "SEPAHIJALA", "SOUTH TRIPURA", "UNAKOTI", "WEST TRIPURA"],
  "UTTAR PRADESH": ["AGRA", "ALIGARH", "ALLAHABAD", "AMBEDKAR NAGAR", "AMETHI", "AMROHA", "AURAIA", "AZAMGARH", "BAGHPAT", "BAHRAICH", "BALLIA", "BALRAMPUR", "BANDA", "BARABANKI", "BAREILLY", "BASTI", "BHADOI", "BIJNOR", "BUDAUN", "BULANDSHAHR", "CHANDAULI", "CHITRAKOOT", "DEORIA", "ETAH", "ETAWAH", "FAIZABAD", "FARRUKHABAD", "FATEHPUR", "FIROZABAD", "GAUTAM BUDDHA NAGAR", "GHAZIABAD", "GHAZIPUR", "GONDA", "GORAKHPUR", "HAMIRPUR", "HAPUR", "HARDOI", "HATHRAS", "JALAUN", "JAUNPUR", "JHANSI", "KANNAUJ", "KANPUR DEHAT", "KANPUR NAGAR", "KASGANJ", "KAUSHAMBI", "KHERI", "KUSHINAGAR", "LALITPUR", "LUCKNOW", "MAHARAJGANJ", "MAHOBA", "MAINPURI", "MATHURA", "MAU", "MEERUT", "MIRZAPUR", "MORADABAD", "MUZAFFARNAGAR", "PILIBHIT", "PRATAPGARH", "RAE BARELI", "RAMPUR", "SAHARANPUR", "SAMBHAL", "SANT KABIR NAGAR", "SHAHJAHANPUR", "SHAMLI", "SHRAVASTI", "SIDDHARTH NAGAR", "SITAPUR", "SONBHADRA", "SULTANPUR", "UNNAO", "VARANASI"],
  "WEST BENGAL": ["BANKURA", "BARDHAMAN", "BIRBHUM", "COOCH BEHAR", "DARJEELING", "EAST MIDNAPORE", "HOOGHLY", "HOWRAH", "JALPAIGURI", "KOLKATA", "MALDA", "MURSHIDABAD", "NADIA", "NORTH 24 PARGANAS", "NORTH DINAJPUR", "PURULIA", "SOUTH 24 PARGANAS", "SOUTH DINAJPUR", "WEST MIDNAPORE"],
  "DADRA NAGAR HAVELI": ["DADRA NAGAR HAVELI"],
  "LAKSHADWEEP": ["LAKSHADWEEP"],
  "TELANGANA": ["ADILABAD", "HYDERABAD", "JAGTIAL", "JANGAON", "KARIMNAGAR", "KHAMMAM", "MAHABUBNAGAR", "MEDAK", "NALGONDA", "NIZAMABAD", "RANGAREDDY", "WARANGAL"],
  "UTTARAKHAND": ["ALMORA", "BAGESHWAR", "CHAMOLI", "CHAMPAWAT", "DEHRADUN", "HARIDWAR", "NAINITAL", "PAURI GARHWAL", "PITHORAGARH", "RUDRA PRAYAG", "TEHRI GARHWAL", "UDHAM SINGH NAGAR", "UTTAR KASHI"],
  "LADAKH": ["LEH", "KARGIL"],
  "DADRA NAGAR HAVELI AND DAMAN AND DIU": ["DADRA NAGAR HAVELI", "DAMAN", "DIU"]
};

const INDIAN_STATES_ORDERED = [
  "CHANDIGARH", "ANDAMAN AND NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "DELHI", "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JAMMU AND KASHMIR", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND", "ORISSA", "PONDICHERRY", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU", "TRIPURA", "UTTAR PRADESH", "WEST BENGAL", "DADRA NAGAR HAVELI", "LAKSHADWEEP", "TELANGANA", "UTTARAKHAND", "LADAKH", "DADRA NAGAR HAVELI AND DAMAN AND DIU"
];

const RELIGIONS = ["BAHAI", "BUDDHISM", "CHRISTIAN", "HINDU", "ISLAM", "JAINISM", "JUDAISM", "SIKHISM", "ZOROASTRIAN", "OTHERS"];

const EDUCATIONAL_QUALIFICATIONS = [
  "BELOW MATRICULATION",
  "GRADUATE",
  "HIGHER SECONDARY",
  "ILLITERATE",
  "MATRICULATION",
  "NA BEING MINOR",
  "OTHERS",
  "POST GRADUATE",
  "PROFESSIONAL"
];

const MARITAL_STATUSES = ["DIVORCED", "MARRIED", "SINGLE"];

const OCCUPATIONS = [
  "AIR FORCE", "BUSINESS PERSON", "CAMERAMAN", "CHARITY/SOCIAL WORKER", "CHARTERED ACCOUNTANT", "COLLEGE/UNIVERSITY TEACHER",
  "DEFENCE", "DIPLOMAT", "DOCTOR", "ENGINEER", "FILM PRODUCER", "GOVERNMENT SERVICE", "HOUSE WIFE", "JOURNALIST",
  "LABOUR", "LAWYER", "MEDIA", "MILITARY", "MISSIONARY", "NAVY", "NEWS BROADCASTER", "OFFICIAL", "OTHERS",
  "PARAMILITARY", "POLICE", "PRESS", "PRIVATE SERVICE", "PUBLISHER", "REPORTER", "RESEARCHER", "RETIRED",
  "SEA MAN", "SECURITY", "SELF EMPLOYED/ FREELANCER", "STUDENT", "TRADER", "TV PRODUCER", "UN-EMPLOYED", "UN OFFICIAL", "WORKER", "WRITER"
];

const PORTS_OF_ARRIVAL = [
  "AGATTI SEAPORT", "AHMEDABAD AIRPORT", "AMRITSAR AIRPORT", "BAGDOGRA AIRPORT", "BENGALURU AIRPORT", "BHUBANESHWAR AIRPORT",
  "CALICUT AIRPORT", "CALICUT SEAPORT", "CHANDIGARH AIRPORT", "CHENNAI AIRPORT", "CHENNAI SEAPORT", "COCHIN AIRPORT",
  "COCHIN SEAPORT", "COIMBATORE AIRPORT", "DELHI AIRPORT", "GAYA AIRPORT", "GOA AIRPORT (DABOLIM)", "GOA AIRPORT (MOPA)",
  "GOA SEAPORT", "GUWAHATI AIRPORT", "HYDERABAD AIRPORT", "INDORE AIRPORT", "JAIPUR AIRPORT", "KAMARAJAR SEAPORT",
  "KANDLA SEAPORT", "KANNUR AIRPORT", "KATTUPALI SEAPORT", "KOLKATA AIRPORT", "KOLKATA SEAPORT", "LUCKNOW AIRPORT",
  "MADURAI AIRPORT", "MANGALORE AIRPORT", "MANGALORE SEAPORT", "MUMBAI AIRPORT", "MUMBAI SEAPORT", "MUNDRA SEAPORT",
  "NAGPUR AIRPORT", "NHAVA SHEVA SEAPORT", "PORT BLAIR AIRPORT", "PORT BLAIR SEAPORT", "PUNE AIRPORT", "RAXAUL LANDPORT",
  "RUPAIDIHA LANDPORT", "SURAT AIRPORT", "TIRUCHIRAPALLI AIRPORT", "TRIVANDRUM AIRPORT", "VALLARPADAM SEAPORT",
  "VARANASI AIRPORT", "VIJAYAWADA AIRPORT", "VISHAKHAPATNAM AIRPORT", "VISHAKHAPATNAM SEAPORT"
];

const PORTS_OF_EXIT = [
  "AHMEDABAD AIRPORT", "AMRITSAR AIRPORT", "BAGDOGRA AIRPORT", "BENGALURU AIRPORT", "BHUBANESHWAR AIRPORT", "CALICUT AIRPORT",
  "CHANDIGARH AIRPORT", "CHENNAI AIRPORT", "COCHIN AIRPORT", "COIMBATORE AIRPORT", "DELHI AIRPORT", "GAYA AIRPORT",
  "GOA AIRPORT (DABOLIM)", "GOA AIRPORT (MOPA)", "GUWAHATI AIRPORT", "HYDERABAD AIRPORT", "INDORE AIRPORT", "JAIPUR AIRPORT",
  "KANNUR AIRPORT", "KOLKATA AIRPORT", "LUCKNOW AIRPORT", "MADURAI AIRPORT", "MANGALORE AIRPORT", "MUMBAI AIRPORT",
  "NAGPUR AIRPORT", "PORT BLAIR AIRPORT", "PUNE AIRPORT", "SURAT AIRPORT", "TIRUCHIRAPALLI AIRPORT", "TRIVANDRUM AIRPORT",
  "VARANASI AIRPORT", "VIJAYAWADA AIRPORT", "VISHAKHAPATNAM AIRPORT"
];

const VISA_SERVICES = [
  { id: 'etourist_30', label: 'e-TOURIST VISA (for 30 Days)', category: 'eTOURIST VISA' },
  { id: 'etourist_1y', label: 'e-TOURIST VISA (for 1 Year)', category: 'eTOURIST VISA' },
  { id: 'etourist_5y', label: 'e-TOURIST VISA (for 5 Years)', category: 'eTOURIST VISA' },
  { id: 'ebusiness', label: 'e-BUSINESS VISA', category: null },
  { id: 'emedical', label: 'e-MEDICAL VISA', category: null },
  { id: 'emedical_attendant', label: 'e-MEDICAL ATTENDANT VISA', category: null },
  { id: 'econference', label: 'e-CONFERENCE VISA', category: null },
];

const generateRandomCaptcha = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const VisaForm: React.FC = () => {
  const [step, setStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<Partial<VisaApplication>>({
    nationality: '',
    passportType: '',
    visaService: 'etourist_30',
    anyOtherPassport: 'No',
    changedName: false,
    livedTwoYears: 'No',
    sameAddress: false,
    pakistanAncestry: 'No',
    militaryService: 'No',
    hotelBooked: 'No',
    visitedIndiaBefore: 'No',
    visaRefused: 'No',
    visitedSaarc: 'No',
    countriesVisited10Years: []
  });
  const [captchaText, setCaptchaText] = useState(generateRandomCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptchaText(generateRandomCaptcha());
    setCaptchaInput('');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => {
        const newData = { ...prev, [name]: checked };
        if (name === 'sameAddress' && checked) {
          newData.permHouseStreet = newData.presHouseStreet;
          newData.permVillageCity = newData.presVillageCity;
          newData.permState = newData.presState;
        }
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        
        // Reset district if the state in India changes
        if (name === 'refStateIndia') {
          newData.refDistrictIndia = '';
        }

        if (prev.sameAddress) {
          if (name === 'presHouseStreet') newData.permHouseStreet = value;
          if (name === 'presVillageCity') newData.permVillageCity = value;
          if (name === 'presState') newData.permState = value;
        }
        return newData;
      });
    }
    setValidationError(null);
  };

  const addCountryVisited = (country: string) => {
    if (country && !formData.countriesVisited10Years?.includes(country)) {
      setFormData(prev => ({
        ...prev,
        countriesVisited10Years: [...(prev.countriesVisited10Years || []), country]
      }));
    }
  };

  const removeCountryVisited = (country: string) => {
    setFormData(prev => ({
      ...prev,
      countriesVisited10Years: (prev.countriesVisited10Years || []).filter(c => c !== country)
    }));
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

  const validateStep1 = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!formData.dateOfBirth) return "Date of Birth is required.";
    const dob = new Date(formData.dateOfBirth);
    if (dob > today) return "Date of Birth cannot be later than today.";
    if (!formData.email || !formData.email.includes('@')) return "Email ID must contain '@'.";
    if (!formData.reEnteredEmail || !formData.reEnteredEmail.includes('@')) return "Re-enter Email ID must contain '@'.";
    if (formData.email !== formData.reEnteredEmail) return "Emails do not match.";
    if (!formData.expectedArrivalDate) return "Expected Date of Arrival is required.";
    const arrivalDate = new Date(formData.expectedArrivalDate);
    const minArrivalDate = new Date(today);
    minArrivalDate.setDate(today.getDate() + 4);
    if (arrivalDate < minArrivalDate) return "Expected Date of Arrival must be at least 4 days from today.";
    if (captchaInput !== captchaText) return "Captcha text does not match.";
    return null;
  };

  const nextStep = () => {
    if (step === 1) {
      const error = validateStep1();
      if (error) {
        setValidationError(error);
        return;
      }
    }
    setStep(prev => (prev < 8 ? (prev + 1) as FormStep : prev));
  };

  const prevStep = () => setStep(prev => (prev > 1 ? (prev - 1) as FormStep : prev));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
            onClick={() => window.location.hash = '#/'}
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
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold text-gray-700 md:text-right">Nationality/Region<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <select name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm" required>
                    <option value="">Select Nationality</option>
                    {NATIONALITIES.map(n => <option key={n} value={n}>{n.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold text-gray-700 md:text-right">Passport Type<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <select name="passportType" value={formData.passportType} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm" required>
                    <option value="">Select Passport Type</option>
                    <option>ORDINARY PASSPORT</option>
                    <option>DIPLOMATIC PASSPORT</option>
                    <option>OFFICIAL PASSPORT</option>
                    <option>SERVICE PASSPORT</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold text-gray-700 md:text-right">Port Of Arrival<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <select name="portOfArrival" value={formData.portOfArrival} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm" required>
                    <option value="">Select Port Of Arrival</option>
                    {PORTS_OF_ARRIVAL.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold text-gray-700 md:text-right">Date of Birth<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-4">
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm" required />
                  <span className="text-xs text-gray-500 italic whitespace-nowrap">(DD/MM/YYYY)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold text-gray-700 md:text-right">Email ID<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold text-gray-700 md:text-right">Re-enter Email ID<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <input type="email" name="reEnteredEmail" value={formData.reEnteredEmail || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                <label className="text-sm font-semibold text-gray-700 md:text-right mt-1">Visa Service<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 space-y-2">
                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                     <p className="font-bold text-xs text-gray-600 mb-2 uppercase tracking-wider">eTOURIST VISA</p>
                     <div className="space-y-1.5 ml-4">
                        {VISA_SERVICES.filter(v => v.category === 'eTOURIST VISA').map(v => (
                          <label key={v.id} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                            <input type="radio" name="visaService" value={v.id} checked={formData.visaService === v.id} onChange={handleInputChange} className="text-orange-600 focus:ring-orange-500" />
                            <span>{v.label}</span>
                          </label>
                        ))}
                     </div>
                     <div className="mt-4 space-y-1.5 ml-0">
                        {VISA_SERVICES.filter(v => v.category === null).map(v => (
                          <label key={v.id} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                            <input type="radio" name="visaService" value={v.id} checked={formData.visaService === v.id} onChange={handleInputChange} className="text-orange-600 focus:ring-orange-500" />
                            <span>{v.label}</span>
                          </label>
                        ))}
                     </div>
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold text-gray-700 md:text-right">Expected Date of Arrival<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-4">
                  <input type="date" name="expectedArrivalDate" value={formData.expectedArrivalDate || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm" required />
                  <span className="text-xs text-gray-500 italic whitespace-nowrap">(DD/MM/YYYY)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 mt-6">
                 <div className="md:col-start-2 md:col-span-2">
                    <div className="flex items-center space-x-4 mb-2">
                       <div className="bg-gray-200 px-6 py-3 rounded-lg font-mono text-2xl tracking-widest relative overflow-hidden select-none border border-gray-300 flex items-center shadow-inner">
                          <span className="relative z-10 italic font-bold text-gray-800" style={{ textShadow: '2px 2px 2px rgba(0,0,0,0.1)' }}>{captchaText}</span>
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-30"></div>
                          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/40 rotate-1"></div>
                          <div className="absolute top-1/3 left-0 w-full h-[1px] bg-black/40 -rotate-2"></div>
                       </div>
                       <button type="button" onClick={refreshCaptcha} className="text-orange-600 hover:text-orange-700 p-2 rounded-full hover:bg-orange-50 transition-colors"><RefreshCw className="h-6 w-6" /></button>
                    </div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Please enter above text<span className="text-red-500">*</span></label>
                    <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value.toLowerCase())} className="w-full px-4 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm" placeholder="Enter verification code" required />
                 </div>
              </div>
              {validationError && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center space-x-2 md:col-start-2 md:col-span-2"><AlertCircle className="h-4 w-4" /><span>{validationError}</span></div>}
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
            <div className="space-y-4 max-w-2xl mx-auto text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Surname (exactly as in your Passport)</label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="surname" value={formData.surname || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" />
                  <span className="text-[10px] text-red-600 font-bold leading-tight">Surname/Family Name (exactly as in Passport)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Given Name/s (exactly as in your Passport)<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="givenNames" value={formData.givenNames || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-red-600 font-bold leading-tight">Given Name/s (exactly as in Passport). Visa may not be granted if name in passport and application do not match.</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right"></label>
                <div className="md:col-span-2 flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span>Have you ever changed your name? If yes, click the box</span>
                    <input type="checkbox" name="changedName" checked={formData.changedName || false} onChange={handleInputChange} className="w-4 h-4 text-orange-600" />
                    <span>and give details.</span>
                  </label>
                  <span className="text-[10px] text-gray-500 italic">If You have ever changed your Name Please tell us.</span>
                </div>
              </div>
              {formData.changedName && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 animate-in slide-in-from-top-2">
                    <label className="font-semibold text-gray-700 md:text-right">Previous Surname</label>
                    <div className="md:col-span-2">
                      <input type="text" name="prevSurname" value={formData.prevSurname || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 animate-in slide-in-from-top-2">
                    <label className="font-semibold text-gray-700 md:text-right">Previous Given Names</label>
                    <div className="md:col-span-2">
                      <input type="text" name="prevGivenNames" value={formData.prevGivenNames || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" />
                    </div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Gender<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <select name="gender" value={formData.gender || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                    <option value="">Select gender</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="TRANSGENDER">TRANSGENDER</option>
                  </select>
                  <span className="text-[10px] text-gray-500">Gender</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Date of Birth<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <span className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-gray-100 font-bold">{formData.dateOfBirth?.split('-').reverse().join('/') || '18/02/1981'}</span>
                  <span className="text-[10px] text-gray-500">Date of Birth as in Passport in DD/MM/YYYY format</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Town/City of birth<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="townOfBirth" value={formData.townOfBirth || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">Province/Town/City of birth</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Country/Region of birth<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <select name="countryOfBirth" value={formData.countryOfBirth || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                    <option value="">Select Country</option>
                    {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                  </select>
                  <span className="text-[10px] text-gray-500">Country/Region of birth</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Citizenship/National Id No.<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="idNumber" value={formData.idNumber || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" placeholder="If not applicable Please Type NA" required />
                  <span className="text-[10px] text-gray-500">If not applicable Please Type NA</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Religion<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <select name="religion" value={formData.religion || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                    <option value="">Select Religion</option>
                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <span className="text-[10px] text-gray-500">If Others, Please specify</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Visible identification marks<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="visibleMarks" value={formData.visibleMarks || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">Visible identification marks</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Educational Qualification<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <select name="educationalQualification" value={formData.educationalQualification || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                    <option value="">Select Education</option>
                    {EDUCATIONAL_QUALIFICATIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <span className="text-[10px] text-gray-500">Educational Qualification</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Qualification acquired from College/University<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="collegeQualification" value={formData.collegeQualification || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">Qualification acquired from College/University</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Nationality/Region<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <span className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-gray-100 font-bold uppercase">{formData.nationality || 'UNITED STATES OF AMERICA'}</span>
                  <span className="text-[10px] text-gray-500">Nationality/Region</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right leading-tight">Did you acquire Nationality by birth or by naturalization?<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <select name="nationalityBy" value={formData.nationalityBy || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                    <option value="">Select ..</option>
                    <option value="BY BIRTH">BY BIRTH</option>
                    <option value="NATURALIZATION">NATURALIZATION</option>
                  </select>
                  <span className="text-[10px] text-gray-500">Did you acquire Nationality by birth or by naturalization?</span>
                </div>
              </div>
              {formData.nationalityBy === 'NATURALIZATION' && (
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 animate-in slide-in-from-top-2">
                  <label className="font-semibold text-gray-700 md:text-right">Prev. Nationality/Region<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="prevNationality" value={formData.prevNationality || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                      <option value="">Select nationality</option>
                      {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">Prev. Nationality/Region</span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right leading-tight">Have you lived for at least two years in the country where you are applying visa?<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="livedTwoYears" value="Yes" checked={formData.livedTwoYears === 'Yes'} onChange={handleInputChange} className="text-orange-600" />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="livedTwoYears" value="No" checked={formData.livedTwoYears === 'No'} onChange={handleInputChange} className="text-orange-600" />
                    <span>No</span>
                  </label>
                </div>
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
            <div className="space-y-4 max-w-2xl mx-auto text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Passport Number<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="passportNumber" value={formData.passportNumber || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">Applicant's Passport Number</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Place of Issue<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="placeOfIssue" value={formData.placeOfIssue || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">Place of Issue</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Date of Issue<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="date" name="dateOfIssue" value={formData.dateOfIssue || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">In DD/MM/YYYY format</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Date of Expiry<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="date" name="dateOfExpiry" value={formData.dateOfExpiry || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500 leading-tight">In DD/MM/YYYY format. Minimum Six Months Validity is Required from journey date.</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-4 border-t border-gray-100">
                <label className="font-semibold text-gray-700 md:text-right leading-tight">Any other valid Passport/Identity Certificate(IC) held,</label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="anyOtherPassport" value="Yes" checked={formData.anyOtherPassport === 'Yes'} onChange={handleInputChange} className="text-orange-600" />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="anyOtherPassport" value="No" checked={formData.anyOtherPassport === 'No'} onChange={handleInputChange} className="text-orange-600" />
                    <span>No</span>
                  </label>
                  <span className="text-[10px] text-gray-500">If Yes Please give details</span>
                </div>
              </div>
              {formData.anyOtherPassport === 'Yes' && (
                <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <label className="font-semibold text-gray-700 md:text-right">Country of Issue<span className="text-red-500">*</span></label>
                    <div className="md:col-span-2 flex items-center space-x-2">
                      <select name="otherPassportCountry" value={formData.otherPassportCountry || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                        <option value="">Select Country</option>
                        {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                      </select>
                      <span className="text-[10px] text-gray-500">Country/Region of Issue</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <label className="font-semibold text-gray-700 md:text-right">Passport/IC No.<span className="text-red-500">*</span></label>
                    <div className="md:col-span-2 flex items-center space-x-2">
                      <input type="text" name="otherPassportNumber" value={formData.otherPassportNumber || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                      <span className="text-[10px] text-gray-500">Passport No</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <label className="font-semibold text-gray-700 md:text-right">Date of Issue<span className="text-red-500">*</span></label>
                    <div className="md:col-span-2 flex items-center space-x-2">
                      <input type="date" name="otherPassportDateOfIssue" value={formData.otherPassportDateOfIssue || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                      <span className="text-[10px] text-gray-500">Date of Issue (In DD/MM/YYYY format)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <label className="font-semibold text-gray-700 md:text-right">Place of Issue<span className="text-red-500">*</span></label>
                    <div className="md:col-span-2 flex items-center space-x-2">
                      <input type="text" name="otherPassportPlaceOfIssue" value={formData.otherPassportPlaceOfIssue || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                      <span className="text-[10px] text-gray-500">Place of Issue</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <label className="font-semibold text-gray-700 md:text-right">Nationality mentioned therein<span className="text-red-500">*</span></label>
                    <div className="md:col-span-2 flex items-center space-x-2">
                      <select name="otherPassportNationality" value={formData.otherPassportNationality || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                        <option value="">Select Nationality</option>
                        {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                      </select>
                      <span className="text-[10px] text-gray-500">Nationality described therein</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <MapPin className="h-6 w-6" />
              <h3 className="text-xl font-bold">Address Details</h3>
            </div>
            <div className="space-y-4 max-w-2xl mx-auto text-sm">
              <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1 mb-4">Present Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">House No./Street<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="presHouseStreet" value={formData.presHouseStreet || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" maxLength={35} required />
                  <span className="text-[10px] text-gray-500 leading-tight">Applicant's Present Address. Maximum 35 characters (Each Line)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Village/Town/City<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="presVillageCity" value={formData.presVillageCity || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">Village/Town/City</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Country<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <select name="presCountry" value={formData.presCountry || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                    <option value="">Select Country</option>
                    {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">State/Province/District<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="presState" value={formData.presState || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">State/Province/District</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Postal/Zip Code<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="presZip" value={formData.presZip || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">Postal/Zip Code</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Phone No.<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="presPhone" value={formData.presPhone || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">One Contact No is Mandatory</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Mobile No.<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="presMobile" value={formData.presMobile || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                  <span className="text-[10px] text-gray-500">Mobile number.</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Email Address</label>
                <div className="md:col-span-2">
                  <span className="font-bold text-gray-800 uppercase">{formData.email || 'N/A'}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-4 border-t border-gray-100">
                <label className="font-semibold text-gray-700 md:text-right">Click here for same address</label>
                <div className="md:col-span-2 flex items-center space-x-4">
                  <input type="checkbox" name="sameAddress" checked={formData.sameAddress || false} onChange={handleInputChange} className="w-5 h-5 text-orange-600" />
                  <span className="text-[10px] text-gray-500 italic">Click here for same address</span>
                </div>
              </div>
              <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1 mt-8 mb-4">Permanent Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">House No./Street<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="permHouseStreet" value={formData.permHouseStreet || ''} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-lg border-gray-300 border ${formData.sameAddress ? 'bg-gray-50' : ''}`} disabled={formData.sameAddress} required />
                  <span className="text-[10px] text-gray-500 leading-tight">Applicant's Permanent Address(with Postal/Zip Code)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">Village/Town/City</label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="permVillageCity" value={formData.permVillageCity || ''} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-lg border-gray-300 border ${formData.sameAddress ? 'bg-gray-50' : ''}`} disabled={formData.sameAddress} />
                  <span className="text-[10px] text-gray-500">Village/Town/City</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="font-semibold text-gray-700 md:text-right">State/Province/District</label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="text" name="permState" value={formData.permState || ''} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-lg border-gray-300 border ${formData.sameAddress ? 'bg-gray-50' : ''}`} disabled={formData.sameAddress} />
                  <span className="text-[10px] text-gray-500">State/Province/District</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <Users className="h-6 w-6" />
              <h3 className="text-xl font-bold">Family & Occupation</h3>
            </div>
            <div className="space-y-6 max-w-2xl mx-auto text-sm">
              <div className="space-y-4">
                <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1 mb-4">Father's Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Name<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="fatherName" value={formData.fatherName || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Applicant's Father Name</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Nationality/Region<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="fatherNationality" value={formData.fatherNationality || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                      <option value="">Select Nationality</option>
                      {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">Nationality/Region of Father</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right leading-tight">Previous Nationality/Region</label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="fatherPrevNationality" value={formData.fatherPrevNationality || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white">
                      <option value="">Select Nationality</option>
                      {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">Previous Nationality/Region of Father</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Place of birth<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="fatherPlaceOfBirth" value={formData.fatherPlaceOfBirth || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Place of birth</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Country/Region of birth<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="fatherCountryOfBirth" value={formData.fatherCountryOfBirth || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                      <option value="">Select Country</option>
                      {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">Country/Region of birth</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1 mb-4">Mother's Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Name<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="motherName" value={formData.motherName || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Applicant's Mother Name</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Nationality/Region<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="motherNationality" value={formData.motherNationality || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                      <option value="">Select Nationality</option>
                      {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">Nationality/Region of Mother</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right leading-tight">Previous Nationality/Region</label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="motherPrevNationality" value={formData.motherPrevNationality || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white">
                      <option value="">Select Nationality</option>
                      {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">Previous Nationality/Region of Mother</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Place of birth<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="motherPlaceOfBirth" value={formData.motherPlaceOfBirth || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Place of birth</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Country/Region of birth<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="motherCountryOfBirth" value={formData.motherCountryOfBirth || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                      <option value="">Select Country</option>
                      {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">Country/Region of birth</span>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-blue-100 rounded-full my-6"></div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Applicant's Marital Status<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                      <option value="">Select Marital Status</option>
                      {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500 italic">Applicant's Marital Status</span>
                  </div>
                </div>
                {formData.maritalStatus === 'MARRIED' && (
                  <div className="space-y-4 pt-4 border-l-4 border-orange-200 pl-6 animate-in slide-in-from-left-2 duration-300">
                    <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1 mb-4">Spouse's Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                      <label className="font-semibold text-gray-700 md:text-right">Name<span className="text-red-500">*</span></label>
                      <div className="md:col-span-2 flex items-center space-x-2">
                        <input type="text" name="spouseName" value={formData.spouseName || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required />
                        <span className="text-[10px] text-gray-500">Applicant's Spouse Name</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                      <label className="font-semibold text-gray-700 md:text-right">Nationality/Region<span className="text-red-500">*</span></label>
                      <div className="md:col-span-2 flex items-center space-x-2">
                        <select name="spouseNationality" value={formData.spouseNationality || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                          <option value="">Select Nationality</option>
                          {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                        </select>
                        <span className="text-[10px] text-gray-500">Nationality/Region of Spouse</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                      <label className="font-semibold text-gray-700 md:text-right leading-tight">Previous Nationality/Region</label>
                      <div className="md:col-span-2 flex items-center space-x-2">
                        <select name="spousePrevNationality" value={formData.spousePrevNationality || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white">
                          <option value="">Select Nationality</option>
                          {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                        </select>
                        <span className="text-[10px] text-gray-500">Previous Nationality/Region of Spouse</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                      <label className="font-semibold text-gray-700 md:text-right">Place of birth<span className="text-red-500">*</span></label>
                      <div className="md:col-span-2 flex items-center space-x-2">
                        <input type="text" name="spousePlaceOfBirth" value={formData.spousePlaceOfBirth || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required />
                        <span className="text-[10px] text-gray-500">Place of birth</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                      <label className="font-semibold text-gray-700 md:text-right">Country/Region of birth<span className="text-red-500">*</span></label>
                      <div className="md:col-span-2 flex items-center space-x-2">
                        <select name="spouseCountryOfBirth" value={formData.spouseCountryOfBirth || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                          <option value="">Select Country</option>
                          {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                        </select>
                        <span className="text-[10px] text-gray-500">Country/Region of birth</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                  <label className="font-semibold text-gray-700 md:text-right leading-tight mt-1">Were your Parents/Grandparents (paternal/maternal) Pakistan Nationals or Belong to Pakistan held area?<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="pakistanAncestry" value="Yes" checked={formData.pakistanAncestry === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                      <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="pakistanAncestry" value="No" checked={formData.pakistanAncestry === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                      <span className="text-[10px] text-gray-500 italic">Please select a value</span>
                    </div>
                    {formData.pakistanAncestry === 'Yes' && (
                      <div className="pt-2">
                        <label className="block text-[10px] font-semibold text-gray-600 mb-1 uppercase">If Yes, give details*</label>
                        <textarea name="pakistanDetails" value={formData.pakistanDetails || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" rows={2} placeholder="Provide specific details..." required />
                        <span className="text-[10px] text-gray-500">If Yes, give details</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider mt-8 mb-4">Profession / Occupation Details of Applicant</div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Present Occupation<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="occupation" value={formData.occupation || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                      <option value="">Select Occupation</option>
                      {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">If Others, please specify</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Employer Name/business<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="employerName" value={formData.employerName || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Employer Name / Business</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Designation<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="employerDesignation" value={formData.employerDesignation || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Designation</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Address<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="occupationAddress" value={formData.occupationAddress || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Address</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Phone</label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="occupationPhone" value={formData.occupationPhone || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" />
                    <span className="text-[10px] text-gray-500">Phone no</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Past Occupation, if any</label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="pastOccupation" value={formData.pastOccupation || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white">
                      <option value="">Select Occupation</option>
                      {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">Past Occupation, if any</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                  <label className="font-semibold text-gray-700 md:text-right leading-tight mt-1">Are/were you in a Military/Semi-Military/Police/Security Organization?<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="militaryService" value="Yes" checked={formData.militaryService === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                      <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="militaryService" value="No" checked={formData.militaryService === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                      <span className="text-[10px] text-gray-500 italic">If yes,give details</span>
                    </div>
                    {formData.militaryService === 'Yes' && (
                      <div className="space-y-4 pt-4 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                          <label className="font-semibold text-gray-700 md:text-right text-xs">Organization<span className="text-red-500">*</span></label>
                          <div className="md:col-span-2 flex items-center space-x-2">
                            <input type="text" name="militaryOrg" value={formData.militaryOrg || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                            <span className="text-[10px] text-gray-500">Organization</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                          <label className="font-semibold text-gray-700 md:text-right text-xs">Designation<span className="text-red-500">*</span></label>
                          <div className="md:col-span-2 flex items-center space-x-2">
                            <input type="text" name="militaryDesignation" value={formData.militaryDesignation || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                            <span className="text-[10px] text-gray-500">Designation</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                          <label className="font-semibold text-gray-700 md:text-right text-xs">Rank<span className="text-red-500">*</span></label>
                          <div className="md:col-span-2 flex items-center space-x-2">
                            <input type="text" name="militaryRank" value={formData.militaryRank || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                            <span className="text-[10px] text-gray-500">Rank</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                          <label className="font-semibold text-gray-700 md:text-right text-xs">Place of Posting<span className="text-red-500">*</span></label>
                          <div className="md:col-span-2 flex items-center space-x-2">
                            <input type="text" name="militaryPosting" value={formData.militaryPosting || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                            <span className="text-[10px] text-gray-500">Place of Posting</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <Plane className="h-6 w-6" />
              <h3 className="text-xl font-bold">Travel Details</h3>
            </div>
            
            <div className="space-y-6 max-w-3xl mx-auto text-sm">
              {/* Section: Details of Visa Sought */}
              <div className="space-y-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider">Details of Visa Sought</div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Places to be visited<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="placesToBeVisited" value={formData.placesToBeVisited || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500 leading-tight">If you intend to visit Protected/Restricted/Cantonment areas, you would require prior permission. <a href="#" className="text-blue-600 underline">Please visit this website.</a></span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Places to be visited line 2</label>
                  <div className="md:col-span-2">
                    <input type="text" name="placesToBeVisited2" value={formData.placesToBeVisited2 || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right leading-tight">Have you booked any room in Hotel/Resort etc. through any Tour Operator?</label>
                  <div className="md:col-span-2 flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="hotelBooked" value="Yes" checked={formData.hotelBooked === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="hotelBooked" value="No" checked={formData.hotelBooked === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Port of Arrival in India<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <span className="font-bold text-gray-800 uppercase bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">{formData.portOfArrival || 'NOT SELECTED'}</span>
                    <span className="text-[10px] text-gray-500">Port of arrival in India</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Expected Port of Exit from India<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <select name="portOfExit" value={formData.portOfExit || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                      <option value="">Select exit point</option>
                      {PORTS_OF_EXIT.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <span className="text-[10px] text-gray-500">Expected Port of Exit from India</span>
                  </div>
                </div>
              </div>

              {/* Section: Previous Visa Details */}
              <div className="space-y-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider">Previous Visa/Currently valid Visa Details</div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Have you ever visited India before?<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visitedIndiaBefore" value="Yes" checked={formData.visitedIndiaBefore === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visitedIndiaBefore" value="No" checked={formData.visitedIndiaBefore === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                    <span className="text-[10px] text-gray-500 ml-4 italic">If Yes Please give Details</span>
                  </div>
                </div>
                {formData.visitedIndiaBefore === 'Yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                    <label className="font-semibold text-gray-700 md:text-right">Visit Details</label>
                    <div className="md:col-span-2"><textarea name="visitedIndiaDetails" value={formData.visitedIndiaDetails || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" rows={2} placeholder="Previous address, visa number, etc." /></div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right leading-tight">Has permission to visit or to extend stay in India previously been refused?</label>
                  <div className="md:col-span-2 flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visaRefused" value="Yes" checked={formData.visaRefused === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visaRefused" value="No" checked={formData.visaRefused === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                    <span className="text-[10px] text-gray-500 italic">Refuse Details Yes /No</span>
                  </div>
                </div>
                {formData.visaRefused === 'Yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                    <label className="font-semibold text-gray-700 md:text-right">Refusal Details</label>
                    <div className="md:col-span-2"><textarea name="visaRefusedDetails" value={formData.visaRefusedDetails || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" rows={2} placeholder="Reason for refusal..." /></div>
                  </div>
                )}
              </div>

              {/* Section: Other Information (Countries Visited) */}
              <div className="space-y-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider">Other Information</div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                  <label className="font-semibold text-gray-700 md:text-right mt-2">Countries Visited in Last 10 years</label>
                  <div className="md:col-span-2 space-y-3">
                    <div className="relative group">
                      <select onChange={(e) => addCountryVisited(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none appearance-none" value="">
                        <option value="" disabled>Select countries..</option>
                        {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400 group-hover:text-orange-600 transition-colors"><Search className="h-4 w-4" /></div>
                    </div>
                    
                    {/* Display Tags */}
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      {formData.countriesVisited10Years && formData.countriesVisited10Years.length > 0 ? (
                        formData.countriesVisited10Years.map(country => (
                          <div key={country} className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 group">
                            <span>{country}</span>
                            <button type="button" onClick={() => removeCountryVisited(country)} className="ml-2 text-orange-400 hover:text-red-600 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-xs flex items-center px-2">No countries selected yet...</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">If information furnished is found to be incorrect at the time of entry or anytime during stay in India, you will be refused entry.</p>
                  </div>
                </div>
              </div>

              {/* Section: SAARC Country Visit Details */}
              <div className="space-y-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider">SAARC Country Visit Details</div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right leading-tight">Have you visited SAARC countries (except your own country) during last 3 years?</label>
                  <div className="md:col-span-2 flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visitedSaarc" value="Yes" checked={formData.visitedSaarc === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visitedSaarc" value="No" checked={formData.visitedSaarc === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                    <span className="text-[10px] text-gray-500 italic">Have you visited "South Asian Association for Regional Cooperation" (SAARC) countries during last 3 years? Yes /No</span>
                  </div>
                </div>
                {formData.visitedSaarc === 'Yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                    <label className="font-semibold text-gray-700 md:text-right">SAARC Visit Details</label>
                    <div className="md:col-span-2"><textarea name="visitedSaarcDetails" value={formData.visitedSaarcDetails || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" rows={2} placeholder="Country, year, duration..." /></div>
                  </div>
                )}
              </div>

              {/* Section: Reference */}
              <div className="space-y-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider">Reference</div>
                <h5 className="font-bold text-orange-600 uppercase text-[10px] tracking-widest pt-2">Reference in India</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Reference Name in India<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="refNameIndia" value={formData.refNameIndia || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Reference Name and Address in India</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                  <label className="font-semibold text-gray-700 md:text-right mt-2">Address<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 space-y-2">
                    <input type="text" name="refAddressIndia1" value={formData.refAddressIndia1 || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" placeholder="Address line 1" required />
                    <input type="text" name="refAddressIndia2" value={formData.refAddressIndia2 || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" placeholder="Address line 2" />
                  </div>
                </div>

                {/* Updated State selection to match image */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">State<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2">
                    <select name="refStateIndia" value={formData.refStateIndia || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white" required>
                      <option value="">Select state</option>
                      {INDIAN_STATES_ORDERED.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Updated District selection - dynamic dropdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">District<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2">
                    <select 
                      name="refDistrictIndia" 
                      value={formData.refDistrictIndia || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-white disabled:bg-gray-100 disabled:cursor-not-allowed" 
                      disabled={!formData.refStateIndia}
                      required
                    >
                      <option value="">Select District</option>
                      {formData.refStateIndia && INDIA_STATES_DISTRICTS[formData.refStateIndia]?.sort().map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Phone No/Mobile No<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="refPhoneIndia" value={formData.refPhoneIndia || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Phone no</span>
                  </div>
                </div>

                <h5 className="font-bold text-orange-600 uppercase text-[10px] tracking-widest pt-4">Reference in {formData.nationality || 'HOME COUNTRY'}</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Reference Name<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="refNameHome" value={formData.refNameHome || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500 leading-tight">Please mention one contact details in Home Country to be contacted in case of emergency</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                  <label className="font-semibold text-gray-700 md:text-right mt-2">Address<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 space-y-2">
                    <input type="text" name="refAddressHome1" value={formData.refAddressHome1 || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" placeholder="Address line 1" required />
                    <input type="text" name="refAddressHome2" value={formData.refAddressHome2 || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" placeholder="Address line 2" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="font-semibold text-gray-700 md:text-right">Phone No/Mobile No<span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input type="text" name="refPhoneHome" value={formData.refPhoneHome || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border-gray-300 border" required />
                    <span className="text-[10px] text-gray-500">Phone no</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <Upload className="h-6 w-6" />
              <h3 className="text-xl font-bold">Documents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-2 border-dashed border-gray-200 p-8 rounded-2xl text-center">
                <Camera className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="font-semibold mb-2">Personal Photo</p>
                <input type="file" onChange={(e) => handleFileUpload(e, 'personalPhoto')} className="hidden" id="photo" />
                <label htmlFor="photo" className="cursor-pointer text-orange-600 font-bold hover:underline">Choose File</label>
                {formData.personalPhoto && <p className="text-green-600 mt-2 text-sm">✓ Uploaded</p>}
              </div>
              <div className="border-2 border-dashed border-gray-200 p-8 rounded-2xl text-center">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="font-semibold mb-2">Passport Scan</p>
                <input type="file" onChange={(e) => handleFileUpload(e, 'passportPhoto')} className="hidden" id="passport" />
                <label htmlFor="passport" className="cursor-pointer text-orange-600 font-bold hover:underline">Choose File</label>
                {formData.passportPhoto && <p className="text-green-600 mt-2 text-sm">✓ Uploaded</p>}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-800">Don't worry about dimensions. Our team will resize and crop your photos professionally.</p>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-xl font-bold">Review & Submit</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Name</span>
                <span className="font-bold">{formData.givenNames || 'N/A'} {formData.surname || ''}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Nationality</span>
                <span className="font-bold">{formData.nationality || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Passport</span>
                <span className="font-bold">{formData.passportNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Port of Arrival</span>
                <span className="font-bold">{formData.portOfArrival || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Date of Birth</span>
                <span className="font-bold">{formData.dateOfBirth?.split('-').reverse().join('/') || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-bold">{formData.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Arrival Date</span>
                <span className="font-bold">{formData.expectedArrivalDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Visa Type</span>
                <span className="font-bold uppercase">{formData.visaService?.replace('_', ' ') || 'N/A'}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">By clicking submit, you agree to our terms and conditions. We will review your data before final government submission.</p>
          </div>
        );
      default: return null;
    }
  };

  const stepsList = ["Basic", "Personal", "Passport", "Address", "Family", "Travel", "Docs", "Review"];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex justify-between items-center overflow-x-auto pb-4 space-x-4">
          {stepsList.map((s, i) => (
            <div key={i} className="flex flex-col items-center min-w-max">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${step === i + 1 ? 'bg-orange-600 text-white' : i + 1 < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i + 1 < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-tighter ${step === i + 1 ? 'text-orange-600' : 'text-gray-400'}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 border border-gray-100">
          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="mt-12 pt-8 border-t flex justify-between">
              <button type="button" onClick={prevStep} disabled={step === 1} className={`flex items-center space-x-2 font-bold ${step === 1 ? 'text-gray-300' : 'text-gray-600'}`}>
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              
              {step < 8 ? (
                <button type="button" onClick={nextStep} className="bg-orange-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-700 flex items-center space-x-2">
                  <span>Continue</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-12 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisaForm;
