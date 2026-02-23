import React, { useState, useCallback } from 'react';
import { VisaApplication, FormStep } from '../types';
import { supabase } from '../lib/supabase';
import {
  ChevronRight, ChevronLeft, CheckCircle, Camera, Upload,
  User, Users, Shield, Plane, Globe, Info, RefreshCw,
  AlertCircle, MapPin, X
} from 'lucide-react';

const NATIONALITIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
  "Denmark","Djibouti","Dominica","Dominican Republic",
  "East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana",
  "Haiti","Honduras","Hungary",
  "Iceland","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway",
  "Oman",
  "Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan",
  "Vanuatu","Venezuela","Vietnam",
  "Yemen",
  "Zambia","Zimbabwe"
];

const RELIGIONS = ["BAHAI","BUDDHISM","CHRISTIAN","HINDU","ISLAM","JAINISM","JUDAISM","SIKHISM","ZOROASTRIAN","OTHERS"];
const EDUCATIONAL_QUALIFICATIONS = ["BELOW MATRICULATION","GRADUATE","HIGHER SECONDARY","ILLITERATE","MATRICULATION","NA BEING MINOR","OTHERS","POST GRADUATE","PROFESSIONAL"];
const MARITAL_STATUSES = ["DIVORCED","MARRIED","SINGLE"];
const OCCUPATIONS = ["AIR FORCE","BUSINESS PERSON","CAMERAMAN","CHARITY/SOCIAL WORKER","CHARTERED ACCOUNTANT","COLLEGE/UNIVERSITY TEACHER","DEFENCE","DIPLOMAT","DOCTOR","ENGINEER","FILM PRODUCER","GOVERNMENT SERVICE","HOUSE WIFE","JOURNALIST","LABOUR","LAWYER","MEDIA","MILITARY","MISSIONARY","NAVY","NEWS BROADCASTER","OFFICIAL","OTHERS","PARAMILITARY","POLICE","PRESS","PRIVATE SERVICE","PUBLISHER","REPORTER","RESEARCHER","RETIRED","SEA MAN","SECURITY","SELF EMPLOYED/ FREELANCER","STUDENT","TRADER","TV PRODUCER","UN-EMPLOYED","UN OFFICIAL","WORKER","WRITER"];
const PORTS_OF_ARRIVAL = ["AGATTI SEAPORT","AHMEDABAD AIRPORT","AMRITSAR AIRPORT","BAGDOGRA AIRPORT","BENGALURU AIRPORT","BHUBANESHWAR AIRPORT","CALICUT AIRPORT","CALICUT SEAPORT","CHANDIGARH AIRPORT","CHENNAI AIRPORT","CHENNAI SEAPORT","COCHIN AIRPORT","COCHIN SEAPORT","COIMBATORE AIRPORT","DELHI AIRPORT","GAYA AIRPORT","GOA AIRPORT (DABOLIM)","GOA AIRPORT (MOPA)","GOA SEAPORT","GUWAHATI AIRPORT","HYDERABAD AIRPORT","INDORE AIRPORT","JAIPUR AIRPORT","KAMARAJAR SEAPORT","KANDLA SEAPORT","KANNUR AIRPORT","KATTUPALI SEAPORT","KOLKATA AIRPORT","KOLKATA SEAPORT","LUCKNOW AIRPORT","MADURAI AIRPORT","MANGALORE AIRPORT","MANGALORE SEAPORT","MUMBAI AIRPORT","MUMBAI SEAPORT","MUNDRA SEAPORT","NAGPUR AIRPORT","NHAVA SHEVA SEAPORT","PORT BLAIR AIRPORT","PORT BLAIR SEAPORT","PUNE AIRPORT","RAXAUL LANDPORT","RUPAIDIHA LANDPORT","SURAT AIRPORT","TIRUCHIRAPALLI AIRPORT","TRIVANDRUM AIRPORT","VALLARPADAM SEAPORT","VARANASI AIRPORT","VIJAYAWADA AIRPORT","VISHAKHAPATNAM AIRPORT","VISHAKHAPATNAM SEAPORT"];
const PORTS_OF_EXIT = ["AHMEDABAD AIRPORT","AMRITSAR AIRPORT","BAGDOGRA AIRPORT","BENGALURU AIRPORT","BHUBANESHWAR AIRPORT","CALICUT AIRPORT","CHANDIGARH AIRPORT","CHENNAI AIRPORT","COCHIN AIRPORT","COIMBATORE AIRPORT","DELHI AIRPORT","GAYA AIRPORT","GOA AIRPORT (DABOLIM)","GOA AIRPORT (MOPA)","GUWAHATI AIRPORT","HYDERABAD AIRPORT","INDORE AIRPORT","JAIPUR AIRPORT","KANNUR AIRPORT","KOLKATA AIRPORT","LUCKNOW AIRPORT","MADURAI AIRPORT","MANGALORE AIRPORT","MUMBAI AIRPORT","NAGPUR AIRPORT","PORT BLAIR AIRPORT","PUNE AIRPORT","SURAT AIRPORT","TIRUCHIRAPALLI AIRPORT","TRIVANDRUM AIRPORT","VARANASI AIRPORT","VIJAYAWADA AIRPORT","VISHAKHAPATNAM AIRPORT"];
const VISA_SERVICES = [
  { id: 'etourist_30', label: 'e-TOURIST VISA (for 30 Days)', price: '$49', category: 'eTOURIST VISA' },
  { id: 'etourist_1y', label: 'e-TOURIST VISA (for 1 Year)', price: '$69', category: 'eTOURIST VISA' },
  { id: 'etourist_5y', label: 'e-TOURIST VISA (for 5 Years)', price: '$99', category: 'eTOURIST VISA' },
  { id: 'emedical', label: 'e-MEDICAL VISA', price: '$79', category: null },
  { id: 'ebusiness', label: 'e-BUSINESS VISA', price: '$79', category: null },
  { id: 'econference', label: 'e-CONFERENCE VISA', price: '$69', category: null },
  { id: 'emedical_attendant', label: 'e-MEDICAL ATTENDANT VISA', price: '$59', category: null },
  { id: 'eayush', label: 'e-AYUSH VISA', price: '$79', category: null },
  { id: 'eayush_attendant', label: 'e-AYUSH ATTENDANT', price: '$59', category: null },
  { id: 'estudent', label: 'e-STUDENT VISA', price: '$69', category: null },
  { id: 'estudent_dependent', label: 'e-STUDENT DEPENDENT', price: '$69', category: null },
  { id: 'eentry', label: 'e-ENTRY VISA', price: '$69', category: null },
  { id: 'efilm', label: 'e-FILM VISA', price: '$79', category: null },
  { id: 'emountaineering', label: 'e-MOUNTAINEERING VISA', price: '$69', category: null },
  { id: 'etransit', label: 'e-TRANSIT VISA', price: '$49', category: null },
  { id: 'eproduction', label: 'e-PRODUCTION INVESTMENT VISA', price: '$79', category: null },
];

const INDIA_STATES_DISTRICTS: Record<string, string[]> = {
  "ANDAMAN AND NICOBAR ISLANDS": ["NICOBAR","NORTH AND MIDDLE ANDAMAN","SOUTH ANDAMAN"],
  "ANDHRA PRADESH": ["ALLURI SITHARAMA RAJU","ANAKAPALLI","ANANTHAPURAMU","ANNAMAYYA","BAPATLA","CHITTOOR","DR. B.R. AMBEDKAR KONASEEMA","EAST GODAVARI","ELURU","GUNTUR","KADAPA","KAKINADA","KRISHNA","KURNOOL","MANYAM","NANDYAL","NTR","PALNADU","PARVATHIPURAM","PRAKASAM","SRI POTTI SRIRAMULU NELLORE","SRIKAKULAM","TIRUPATI","VISAKHAPATNAM","VIZIANAGARAM","WEST GODAVARI"],
  "ARUNACHAL PRADESH": ["ANJAW","CHANGLANG","DIBANG VALLEY","EAST KAMENG","EAST SIANG","KAMLE","KRA DAADI","KURUNG KUMEY","LEPA RADA","LOHIT","LONGDING","LOWER DIBANG VALLEY","LOWER SIANG","LOWER SUBANSIRI","NAMSAI","PAKKE KESSANG","PAPUM PARE","SHI YOMI","SIANG","TAWANG","TIRAP","UPPER SIANG","UPPER SUBANSIRI","WEST KAMENG","WEST SIANG"],
  "ASSAM": ["BAJALI","BAKSA","BARPETA","BISWANATH","BONGAIGAON","CACHAR","CHARAIDEO","CHIRANG","DARRANG","DHEMAJI","DHUBRI","DIBRUGARH","DIMA HASAO","GOALPARA","GOLAGHAT","HAILAKANDI","HOJAI","JORHAT","KAMRUP","KAMRUP METROPOLITAN","KARBI ANGLONG","KARIMGANJ","KOKRAJHAR","LAKHIMPUR","MAJULI","MORIGAON","NAGAON","NALBARI","SIVASAGAR","SONITPUR","SOUTH SALMARA-MANKACHAR","TAMULPUR","TINSUKIA","UDALGURI","WEST KARBI ANGLONG"],
  "BIHAR": ["ARARIA","ARWAL","AURANGABAD","BANKA","BEGUSARAI","BHAGALPUR","BHOJPUR","BUXAR","DARBHANGA","EAST CHAMPARAN","GAYA","GOPALGANJ","JAMUI","JEHANABAD","KAIMUR","KATIHAR","KHAGARIA","KISHANGANJ","LAKHISARAI","MADHEPURA","MADHUBANI","MUNGER","MUZAFFARPUR","NALANDA","NAWADA","PATNA","PURNIA","ROHTAS","SAHARSA","SAMASTIPUR","SARAN","SHEIKHPURA","SHEOHAR","SITAMARHI","SIWAN","SUPAUL","VAISHALI","WEST CHAMPARAN"],
  "CHANDIGARH": ["CHANDIGARH"],
  "CHHATTISGARH": ["BALOD","BALODA BAZAR","BALRAMPUR","BASTAR","BEMETARA","BIJAPUR","BILASPUR","DANTEWADA","DHAMTARI","DURG","GARIABAND","GAURELA-PENDRA-MARWAHI","JANJGIR-CHAMPA","JASHPUR","KABIRDHAM","KANKER","KHAIRAGARH","KONDAGAON","KORBA","KORIYA","MAHASAMUND","MANENDRAGARH","MOHLA-MANPUR","MUNGELI","NARAYANPUR","RAIGARH","RAIPUR","RAJNANDGAON","SAKTI","SARANGARH-BILAIGARH","SUKMA","SURAJPUR","SURGUJA"],
  "DADRA AND NAGAR HAVELI AND DAMAN AND DIU": ["DADRA AND NAGAR HAVELI","DAMAN","DIU"],
  "DELHI": ["CENTRAL DELHI","EAST DELHI","NEW DELHI","NORTH DELHI","NORTH EAST DELHI","NORTH WEST DELHI","SOUTH DELHI","SOUTH EAST DELHI","SOUTH WEST DELHI","WEST DELHI"],
  "GOA": ["NORTH GOA","SOUTH GOA"],
  "MAHARASHTRA": ["AHMEDNAGAR","AKOLA","AMRAVATI","AURANGABAD","BEED","BHANDARA","BULDHANA","CHANDRAPUR","DHULE","GADCHIROLI","GONDIA","HINGOLI","JALGAON","JALNA","KOLHAPUR","LATUR","MUMBAI","MUMBAI CITY","MUMBAI SUBURBAN","NAGPUR","NANDED","NANDURBAR","NASHIK","OSMANABAD","PALGHAR","PARBHANI","PUNE","RAIGAD","RATNAGIRI","SANGLI","SATARA","SINDHUDURG","SOLAPUR","THANE","WARDHA","WASHIM","YAVATMAL"],
  "KARNATAKA": ["BAGALKOT","BANGALORE","BANGALORE RURAL","BELGAUM","BELLARY","BIDAR","CHAMARAJANAGAR","CHIKBALLAPUR","CHIKMAGALUR","CHITRADURGA","DAKSHINA KANNADA","DAVANGERE","DHARWAD","GADAG","GULBARGA","HASSAN","HAVERI","KODAGU","KOLAR","KOPPAL","MANDYA","MYSORE","RAICHUR","RAMANAGARA","SHIMOGA","TUMKUR","UDUPI","UTTARA KANNADA","VIJAYAPURA","YADGIR"],
  "TAMIL NADU": ["ARIYALUR","CHENNAI","COIMBATORE","CUDDALORE","DHARMAPURI","DINDIGUL","ERODE","KANCHIPURAM","KANNIYAKUMARI","KARUR","KRISHNAGIRI","MADURAI","NAGAPATTINAM","NAMAKKAL","NILGIRIS","PERAMBALUR","PUDUKKOTTAI","RAMANATHAPURAM","SALEM","SIVAGANGA","THANJAVUR","THENI","THOOTHUKKUDI","TIRUCHIRAPPALLI","TIRUNELVELI","TIRUPPUR","TIRUVALLUR","TIRUVANNAMALAI","TIRUVARUR","VELLORE","VILUPPURAM","VIRUDHUNAGAR"],
  "KERALA": ["ALAPPUZHA","ERNAKULAM","IDUKKI","KANNUR","KASARAGOD","KOLLAM","KOTTAYAM","KOZHIKODE","MALAPPURAM","PALAKKAD","PATHANAMTHITTA","THIRUVANANTHAPURAM","THRISSUR","WAYANAD"],
  "GUJARAT": ["AHMEDABAD","AMRELI","ANAND","ARAVALLI","BANAS KANTHA","BHARUCH","BHAVNAGAR","BOTAD","CHHOTA UDEPUR","DAHOD","DANG","DEVBHUMI DWARKA","GANDHINAGAR","GIR SOMNATH","JAMNAGAR","JUNAGADH","KACHCHH","KHEDA","MAHISAGAR","MEHSANA","MORBI","NARMADA","NAVSARI","PANCH MAHALS","PATAN","PORBANDAR","RAJKOT","SABAR KANTHA","SURAT","SURENDRANAGAR","TAPI","VADODARA","VALSAD"],
  "RAJASTHAN": ["AJMER","ALWAR","BANSWARA","BARAN","BARMER","BHARATPUR","BHILWARA","BIKANER","BUNDI","CHITTORGARH","CHURU","DAUSA","DHOLPUR","DUNGARPUR","GANGANAGAR","HANUMANGARH","JAIPUR","JAISALMER","JALORE","JHALAWAR","JHUNJHUNU","JODHPUR","KARAULI","KOTA","NAGAUR","PALI","PRATAPGARH","RAJSAMAND","SAWAI MADHOPUR","SIKAR","SIROHI","TONK","UDAIPUR"],
  "UTTAR PRADESH": ["AGRA","ALIGARH","ALLAHABAD","AMBEDKAR NAGAR","AMETHI","AMROHA","AURAIA","AZAMGARH","BAGHPAT","BAHRAICH","BALLIA","BALRAMPUR","BANDA","BARABANKI","BAREILLY","BASTI","BHADOI","BIJNOR","BUDAUN","BULANDSHAHR","CHANDAULI","CHITRAKOOT","DEORIA","ETAH","ETAWAH","FAIZABAD","FARRUKHABAD","FATEHPUR","FIROZABAD","GAUTAM BUDDHA NAGAR","GHAZIABAD","GHAZIPUR","GONDA","GORAKHPUR","HAMIRPUR","HAPUR","HARDOI","HATHRAS","JALAUN","JAUNPUR","JHANSI","KANNAUJ","KANPUR DEHAT","KANPUR NAGAR","KASGANJ","KAUSHAMBI","KHERI","KUSHINAGAR","LALITPUR","LUCKNOW","MAHARAJGANJ","MAHOBA","MAINPURI","MATHURA","MAU","MEERUT","MIRZAPUR","MORADABAD","MUZAFFARNAGAR","PILIBHIT","PRATAPGARH","RAE BARELI","RAMPUR","SAHARANPUR","SAMBHAL","SANT KABIR NAGAR","SHAHJAHANPUR","SHAMLI","SHRAVASTI","SIDDHARTH NAGAR","SITAPUR","SONBHADRA","SULTANPUR","UNNAO","VARANASI"],
  "HARYANA": ["AMBALA","BHIWANI","CHARKHI DADRI","FARIDABAD","FATEHABAD","GURUGRAM","HISAR","JHAJJAR","JIND","KAITHAL","KARNAL","KURUKSHETRA","MAHENDRAGARH","NUH","PALWAL","PANCHKULA","PANIPAT","REWARI","ROHTAK","SIRSA","SONIPAT","YAMUNANAGAR"],
  "HIMACHAL PRADESH": ["BILASPUR","CHAMBA","HAMIRPUR","KANGRA","KINNAUR","KULLU","LAHAUL AND SPITI","MANDI","SHIMLA","SIRMAUR","SOLAN","UNA"],
  "JAMMU AND KASHMIR": ["ANANTNAG","BANDIPORA","BARAMULLA","BUDGAM","DODA","GANDERBAL","JAMMU","KATHUA","KISHTWAR","KULGAM","KUPWARA","POONCH","PULWAMA","RAJOURI","RAMBAN","REASI","SAMBA","SHOPIAN","SRINAGAR","UDHAMPUR"],
  "JHARKHAND": ["BOKARO","CHATRA","DEOGHAR","DHANBAD","DUMKA","EAST SINGHBHUM","GARHWA","GIRIDIH","GODDA","GUMLA","HAZARIBAGH","JAMTARA","KHUNTI","KODERMA","LATEHAR","LOHARDAGA","PAKUR","PALAMU","RAMGARH","RANCHI","SAHEBGANJ","SERAIKELA KHARSAWAN","SIMDEGA","WEST SINGHBHUM"],
  "LADAKH": ["KARGIL","LEH"],
  "LAKSHADWEEP": ["LAKSHADWEEP"],
  "MANIPUR": ["BISHNUPUR","CHANDEL","CHURACHANDPUR","IMPHAL EAST","IMPHAL WEST","JIRIBAM","KAKCHING","KAMJONG","KANGPOKPI","NONEY","PHERZAWL","SENAPATI","TAMENGLONG","TENGNOUPAL","THOUBAL","UKHRUL"],
  "MEGHALAYA": ["EAST GARO HILLS","EAST JAINTIA HILLS","EAST KHASI HILLS","EASTERN WEST KHASI HILLS","NORTH GARO HILLS","RI BHOI","SOUTH GARO HILLS","SOUTH WEST GARO HILLS","SOUTH WEST KHASI HILLS","WEST GARO HILLS","WEST JAINTIA HILLS","WEST KHASI HILLS"],
  "MIZORAM": ["AIZAWL","CHAMPHAI","HNAHTHIAL","KHAWZAWL","KOLASIB","LAWNGTLAI","LUNGLEI","MAMIT","SAIHA","SAITUAL","SERCHHIP"],
  "NAGALAND": ["CHUMOUKEDIMA","DIMAPUR","KIPHIRE","KOHIMA","LONGLENG","MOKOKCHUNG","MON","NIULAND","NOKLAK","PEREN","PHEK","SHAMATOR","TSEMINYU","TUENSANG","WOKHA","ZUNHEBOTO"],
  "ODISHA": ["ANGUL","BALANGIR","BALASORE","BARGARH","BHADRAK","BOUDH","CUTTACK","DEOGARH","DHENKANAL","GAJAPATI","GANJAM","JAGATSINGHPUR","JAJPUR","JHARSUGUDA","KALAHANDI","KANDHAMAL","KENDRAPARA","KENDUJHAR","KHORDHA","KORAPUT","MALKANGIRI","MAYURBHANJ","NABARANGPUR","NAYAGARH","NUAPADA","PURI","RAYAGADA","SAMBALPUR","SUBARNAPUR","SUNDARGARH"],
  "PUDUCHERRY": ["KARAIKAL","MAHE","PUDUCHERRY","YANAM"],
  "PUNJAB": ["AMRITSAR","BARNALA","BATHINDA","FARIDKOT","FATEHGARH SAHIB","FAZILKA","FEROZEPUR","GURDASPUR","HOSHIARPUR","JALANDHAR","KAPURTHALA","LUDHIANA","MALERKOTLA","MANSA","MOGA","MOHALI","MUKTSAR","NAWANSHAHR","PATHANKOT","PATIALA","RUPNAGAR","SANGRUR","TARN TARAN"],
  "SIKKIM": ["EAST SIKKIM","NORTH SIKKIM","PAKYONG","SORENG","SOUTH SIKKIM","WEST SIKKIM"],
  "TELANGANA": ["ADILABAD","BHADRADRI KOTHAGUDEM","HANAMKONDA","HYDERABAD","JAGTIAL","JANGAON","JAYASHANKAR BHUPALPALLY","JOGULAMBA GADWAL","KAMAREDDY","KARIMNAGAR","KHAMMAM","KUMURAM BHEEM ASIFABAD","MAHABUBABAD","MAHABUBNAGAR","MANCHERIAL","MEDAK","MEDCHAL-MALKAJGIRI","MULUGU","NAGARKURNOOL","NALGONDA","NARAYANPET","NIRMAL","NIZAMABAD","PEDDAPALLI","RAJANNA SIRCILLA","RANGAREDDY","SANGAREDDY","SIDDIPET","SURYAPET","VIKARABAD","WANAPARTHY","WARANGAL","YADADRI BHUVANAGIRI"],
  "TRIPURA": ["DHALAI","GOMATI","KHOWAI","NORTH TRIPURA","SEPAHIJALA","SOUTH TRIPURA","UNAKOTI","WEST TRIPURA"],
  "UTTARAKHAND": ["ALMORA","BAGESHWAR","CHAMOLI","CHAMPAWAT","DEHRADUN","HARIDWAR","NAINITAL","PAURI GARHWAL","PITHORAGARH","RUDRAPRAYAG","TEHRI GARHWAL","UDHAM SINGH NAGAR","UTTARKASHI"],
  "WEST BENGAL": ["BANKURA","BARDHAMAN","BIRBHUM","COOCH BEHAR","DARJEELING","EAST MIDNAPORE","HOOGHLY","HOWRAH","JALPAIGURI","KOLKATA","MALDA","MURSHIDABAD","NADIA","NORTH 24 PARGANAS","NORTH DINAJPUR","PURULIA","SOUTH 24 PARGANAS","SOUTH DINAJPUR","WEST MIDNAPORE"],
};

const generateRandomCaptcha = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  return captcha;
};

const inp = "w-full px-4 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm";
const row = "grid grid-cols-1 md:grid-cols-3 items-center gap-4";
const lbl = "text-sm font-semibold text-gray-700 md:text-right";
const hint = "text-[10px] text-gray-500 leading-tight";

const SAARC_COUNTRIES = ["AFGHANISTAN","BANGLADESH","BHUTAN","MALDIVES","NEPAL","PAKISTAN","SRI LANKA"];
const SAARC_YEARS = Array.from({length: 30}, (_, i) => String(new Date().getFullYear() - i));

interface SaarcEntry { country: string; year: string; visits: string; }

const SaarcCountryVisits: React.FC<{ entries: SaarcEntry[]; onChange: (e: SaarcEntry[]) => void; inp: string }> = ({ entries, onChange, inp: inpClass }) => {
  const addRow = () => onChange([...entries, { country: "", year: "", visits: "" }]);
  const removeRow = () => { if (entries.length > 1) onChange(entries.slice(0, -1)); };
  const update = (i: number, field: keyof SaarcEntry, val: string) => {
    onChange(entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  };
  const rows = entries.length > 0 ? entries : [{ country: "", year: "", visits: "" }];
  return (
    <div className="md:col-span-3 mt-2">
      <div className="grid grid-cols-3 gap-3 mb-1 px-1">
        <span className="text-xs font-semibold text-gray-700">Name of SAARC country<span className="text-red-500">*</span></span>
        <span className="text-xs font-semibold text-gray-700">Year<span className="text-red-500">*</span></span>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">No. of visits<span className="text-red-500">*</span></span>
          <div className="flex space-x-2">
            <button type="button" onClick={addRow} className="text-orange-600 hover:text-orange-800 font-bold text-xl leading-none">+</button>
            <button type="button" onClick={removeRow} className="text-orange-600 hover:text-orange-800 font-bold text-xl leading-none">−</button>
          </div>
        </div>
      </div>
      {rows.map((entry, i) => (
        <div key={i} className="grid grid-cols-3 gap-3 mb-2">
          <select value={entry.country} onChange={e => update(i, "country", e.target.value)} className={inpClass} required>
            <option value="">Select country</option>
            {SAARC_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={entry.year} onChange={e => update(i, "year", e.target.value)} className={inpClass} required>
            <option value="">Select year</option>
            {SAARC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <input type="number" min="1" value={entry.visits} onChange={e => update(i, "visits", e.target.value)} className={inpClass} required />
        </div>
      ))}
    </div>
  );
};

const VisaForm: React.FC = () => {
  const [step, setStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<Partial<VisaApplication>>({
    nationality: '', passportType: '', visaService: 'etourist_30',
    anyOtherPassport: 'No', changedName: false, livedTwoYears: 'No',
    sameAddress: false, pakistanAncestry: 'No', militaryService: 'No',
    hotelBooked: 'No', visitedIndiaBefore: 'No', visaRefused: 'No',
    visitedSaarc: 'No', countriesVisited10Years: [], saarcCountries: [] as SaarcEntry[]
  });
  const [captchaText, setCaptchaText] = useState(generateRandomCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const refreshCaptcha = useCallback(() => { setCaptchaText(generateRandomCaptcha()); setCaptchaInput(''); }, []);

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
        if (name === 'refStateIndia') newData.refDistrictIndia = '';
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
      setFormData(prev => ({ ...prev, countriesVisited10Years: [...(prev.countriesVisited10Years || []), country] }));
    }
  };

  const removeCountryVisited = (country: string) => {
    setFormData(prev => ({ ...prev, countriesVisited10Years: (prev.countriesVisited10Years || []).filter(c => c !== country) }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'passportPhoto' | 'personalPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!formData.dateOfBirth) return "Date of Birth is required.";
    if (new Date(formData.dateOfBirth) > today) return "Date of Birth cannot be later than today.";
    if (!formData.email || !formData.email.includes('@')) return "Email ID must contain '@'.";
    if (!formData.reEnteredEmail || !formData.reEnteredEmail.includes('@')) return "Re-enter Email ID must contain '@'.";
    if (formData.email !== formData.reEnteredEmail) return "Emails do not match.";
    if (!formData.expectedArrivalDate) return "Expected Date of Arrival is required.";
    const arrivalDate = new Date(formData.expectedArrivalDate);
    const minDate = new Date(today); minDate.setDate(today.getDate() + 4);
    if (arrivalDate < minDate) return "Expected Date of Arrival must be at least 4 days from today.";
    if (captchaInput !== captchaText) return "Captcha text does not match.";
    return null;
  };

  const nextStep = () => {
    if (step === 1) { const error = validateStep1(); if (error) { setValidationError(error); return; } }
    setStep(prev => (prev < 8 ? (prev + 1) as FormStep : prev));
    window.scrollTo(0, 0);
  };

  const prevStep = () => { setStep(prev => (prev > 1 ? (prev - 1) as FormStep : prev)); window.scrollTo(0, 0); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Uložiť žiadosť do Supabase
      const { data, error } = await supabase
        .from('visa_applications')
        .insert([{
          nationality: formData.nationality,
          passport_type: formData.passportType,
          port_of_arrival: formData.portOfArrival,
          date_of_birth: formData.dateOfBirth,
          email: formData.email,
          visa_service: formData.visaService,
          expected_arrival_date: formData.expectedArrivalDate,
          surname: formData.surname,
          given_names: formData.givenNames,
          changed_name: formData.changedName,
          prev_surname: formData.prevSurname,
          prev_given_names: formData.prevGivenNames,
          gender: formData.gender,
          town_of_birth: formData.townOfBirth,
          country_of_birth: formData.countryOfBirth,
          id_number: formData.idNumber,
          religion: formData.religion,
          visible_marks: formData.visibleMarks,
          educational_qualification: formData.educationalQualification,
          college_qualification: formData.collegeQualification,
          nationality_by: formData.nationalityBy,
          prev_nationality: formData.prevNationality,
          lived_two_years: formData.livedTwoYears,
          passport_number: formData.passportNumber,
          place_of_issue: formData.placeOfIssue,
          date_of_issue: formData.dateOfIssue,
          date_of_expiry: formData.dateOfExpiry,
          any_other_passport: formData.anyOtherPassport,
          other_passport_country: formData.otherPassportCountry,
          other_passport_number: formData.otherPassportNumber,
          pres_house_street: formData.presHouseStreet,
          pres_village_city: formData.presVillageCity,
          pres_country: formData.presCountry,
          pres_state: formData.presState,
          pres_zip: formData.presZip,
          pres_phone: formData.presPhone,
          pres_mobile: formData.presMobile,
          same_address: formData.sameAddress,
          perm_house_street: formData.permHouseStreet,
          perm_village_city: formData.permVillageCity,
          perm_state: formData.permState,
          father_name: formData.fatherName,
          father_nationality: formData.fatherNationality,
          mother_name: formData.motherName,
          mother_nationality: formData.motherNationality,
          marital_status: formData.maritalStatus,
          spouse_name: formData.spouseName,
          pakistan_ancestry: formData.pakistanAncestry,
          pakistan_details: formData.pakistanDetails,
          occupation: formData.occupation,
          employer_name: formData.employerName,
          employer_designation: formData.employerDesignation,
          occupation_address: formData.occupationAddress,
          military_service: formData.militaryService,
          places_to_be_visited: formData.placesToBeVisited,
          port_of_exit: formData.portOfExit,
          visited_india_before: formData.visitedIndiaBefore,
          visited_india_details: formData.visitedIndiaDetails,
          visited_india_address1: formData.visitedIndiaAddress1,
          visited_india_address2: formData.visitedIndiaAddress2,
          visited_india_address3: formData.visitedIndiaAddress3,
          cities_visited_india: formData.citiesVisitedIndia,
          last_indian_visa_no: formData.lastIndianVisaNo,
          last_visa_type: formData.lastVisaType,
          last_visa_place_of_issue: formData.lastVisaPlaceOfIssue,
          last_visa_date_of_issue: formData.lastVisaDateOfIssue,
          visa_refused: formData.visaRefused,
          visa_refused_when_by_whom: formData.visaRefusedDetails,
          countries_visited_10_years: formData.countriesVisited10Years,
          hotel_address: formData.hotelAddress,
          visited_saarc: formData.visitedSaarc,
          saarc_countries: formData.saarcCountries,
          ref_name_india: formData.refNameIndia,
          ref_address_india1: formData.refAddressIndia1,
          ref_phone_india: formData.refPhoneIndia,
          ref_name_home: formData.refNameHome,
          ref_address_home1: formData.refAddressHome1,
          ref_phone_home: formData.refPhoneHome,
          passport_photo: formData.passportPhoto,
          personal_photo: formData.personalPhoto,
          payment_status: 'pending',
          application_status: 'draft',
        }])
        .select()
        .single();

      if (error) throw error;

      // 2. Vytvoriť Stripe Checkout session
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: data.id,
          visaService: formData.visaService,
          email: formData.email,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Payment session creation failed');
      }

      const { url } = await res.json();
      window.location.href = url;

    } catch (err: any) {
      console.error('Submit error:', err);
      const message = err?.message || 'Unknown error';
      setSubmitError(`${message} Please try again or contact support.`);
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Basic Info', icon: <Globe className="h-4 w-4" /> },
    { num: 2, label: 'Personal', icon: <User className="h-4 w-4" /> },
    { num: 3, label: 'Passport', icon: <Shield className="h-4 w-4" /> },
    { num: 4, label: 'Address', icon: <MapPin className="h-4 w-4" /> },
    { num: 5, label: 'Family', icon: <Users className="h-4 w-4" /> },
    { num: 6, label: 'Travel', icon: <Plane className="h-4 w-4" /> },
    { num: 7, label: 'Photos', icon: <Camera className="h-4 w-4" /> },
    { num: 8, label: 'Payment', icon: <Upload className="h-4 w-4" /> },
  ];

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
              <div className={row}>
                <label className={lbl}>Nationality/Region<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <select name="nationality" value={formData.nationality} onChange={handleInputChange} className={inp} required>
                    <option value="">Select Nationality</option>
                    {NATIONALITIES.map(n => <option key={n} value={n}>{n.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className={row}>
                <label className={lbl}>Passport Type<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <select name="passportType" value={formData.passportType} onChange={handleInputChange} className={inp} required>
                    <option value="">Select Passport Type</option>
                    <option>ORDINARY PASSPORT</option>
                    <option>DIPLOMATIC PASSPORT</option>
                    <option>OFFICIAL PASSPORT</option>
                    <option>SERVICE PASSPORT</option>
                  </select>
                </div>
              </div>
              <div className={row}>
                <label className={lbl}>Port Of Arrival<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <select name="portOfArrival" value={formData.portOfArrival} onChange={handleInputChange} className={inp} required>
                    <option value="">Select Port Of Arrival</option>
                    {PORTS_OF_ARRIVAL.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className={row}>
                <label className={lbl}>Date of Birth<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleInputChange} className={inp} required />
                </div>
              </div>
              <div className={row}>
                <label className={lbl}>Email ID<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className={inp} required />
                </div>
              </div>
              <div className={row}>
                <label className={lbl}>Re-enter Email ID<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <input type="email" name="reEnteredEmail" value={formData.reEnteredEmail || ''} onChange={handleInputChange} className={inp} required />
                  {formData.reEnteredEmail && formData.email !== formData.reEnteredEmail && (
                    <p className="text-red-500 text-xs mt-1">Email addresses do not match.</p>
                  )}
                  {formData.reEnteredEmail && formData.email === formData.reEnteredEmail && (
                    <p className="text-green-600 text-xs mt-1">✓ Emails match.</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                <label className={lbl + " mt-1"}>Visa Service<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                  <p className="font-bold text-xs text-gray-600 mb-2 uppercase tracking-wider">eTOURIST VISA</p>
                  {VISA_SERVICES.filter(v => v.category === 'eTOURIST VISA').map(v => (
                    <label key={v.id} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                      <input type="radio" name="visaService" value={v.id} checked={formData.visaService === v.id} onChange={handleInputChange} className="text-orange-600" />
                      <span>{v.label}</span>
                      <span className="ml-auto font-bold text-orange-600">{v.price}</span>
                    </label>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                    {VISA_SERVICES.filter(v => v.category === null).map(v => (
                      <label key={v.id} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                        <input type="radio" name="visaService" value={v.id} checked={formData.visaService === v.id} onChange={handleInputChange} className="text-orange-600" />
                        <span>{v.label}</span>
                        <span className="ml-auto font-bold text-orange-600">{v.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className={row}>
                <label className={lbl}>Expected Date of Arrival<span className="text-red-500">*</span></label>
                <div className="md:col-span-2">
                  <input type="date" name="expectedArrivalDate" value={formData.expectedArrivalDate || ''} onChange={handleInputChange} className={inp} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="md:col-start-2 md:col-span-2">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="bg-gray-200 px-6 py-3 rounded-lg font-mono text-2xl tracking-widest relative overflow-hidden select-none border border-gray-300 flex items-center shadow-inner">
                      <span className="relative z-10 italic font-bold text-gray-800">{captchaText}</span>
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/40 rotate-1"></div>
                    </div>
                    <button type="button" onClick={refreshCaptcha} className="text-orange-600 hover:text-orange-700 p-2 rounded-full hover:bg-orange-50 transition-colors">
                      <RefreshCw className="h-6 w-6" />
                    </button>
                  </div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Please enter above text<span className="text-red-500">*</span></label>
                  <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value.toLowerCase())} className={inp} placeholder="Enter verification code" required />
                </div>
              </div>
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
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
              <div className={row}><label className={lbl}>Surname</label><div className="md:col-span-2"><input type="text" name="surname" value={formData.surname || ''} onChange={handleInputChange} className={inp} /></div></div>
              <div className={row}><label className={lbl}>Given Name/s<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="givenNames" value={formData.givenNames || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}>
                <label className={lbl}></label>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input type="checkbox" name="changedName" checked={formData.changedName || false} onChange={handleInputChange} className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Have you ever changed your name?</span>
                </div>
              </div>
              {formData.changedName && (<>
                <div className={row}><label className={lbl}>Previous Surname</label><div className="md:col-span-2"><input type="text" name="prevSurname" value={formData.prevSurname || ''} onChange={handleInputChange} className={inp} /></div></div>
                <div className={row}><label className={lbl}>Previous Given Names</label><div className="md:col-span-2"><input type="text" name="prevGivenNames" value={formData.prevGivenNames || ''} onChange={handleInputChange} className={inp} /></div></div>
              </>)}
              <div className={row}><label className={lbl}>Gender<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="gender" value={formData.gender || ''} onChange={handleInputChange} className={inp} required><option value="">Select gender</option><option value="MALE">MALE</option><option value="FEMALE">FEMALE</option><option value="TRANSGENDER">TRANSGENDER</option></select></div></div>
              <div className={row}><label className={lbl}>Date of Birth</label><div className="md:col-span-2"><span className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-gray-100 font-bold block">{formData.dateOfBirth?.split('-').reverse().join('/') || '-'}</span></div></div>
              <div className={row}><label className={lbl}>Town/City of birth<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="townOfBirth" value={formData.townOfBirth || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Country/Region of birth<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="countryOfBirth" value={formData.countryOfBirth || ''} onChange={handleInputChange} className={inp} required><option value="">Select Country</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
              <div className={row}><label className={lbl}>Citizenship/National Id No.<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="idNumber" value={formData.idNumber || ''} onChange={handleInputChange} className={inp} placeholder="If not applicable type NA" required /></div></div>
              <div className={row}><label className={lbl}>Religion<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="religion" value={formData.religion || ''} onChange={handleInputChange} className={inp} required><option value="">Select Religion</option>{RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}</select></div></div>
              <div className={row}><label className={lbl}>Visible identification marks<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="visibleMarks" value={formData.visibleMarks || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Educational Qualification<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="educationalQualification" value={formData.educationalQualification || ''} onChange={handleInputChange} className={inp} required><option value="">Select Education</option>{EDUCATIONAL_QUALIFICATIONS.map(e => <option key={e} value={e}>{e}</option>)}</select></div></div>
              <div className={row}><label className={lbl}>College/University<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="collegeQualification" value={formData.collegeQualification || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Nationality/Region</label><div className="md:col-span-2"><span className="w-full px-4 py-2 rounded-lg border-gray-300 border bg-gray-100 font-bold block uppercase">{formData.nationality || '-'}</span></div></div>
              <div className={row}><label className={lbl}>Nationality acquired by<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="nationalityBy" value={formData.nationalityBy || ''} onChange={handleInputChange} className={inp} required><option value="">Select...</option><option value="BY BIRTH">BY BIRTH</option><option value="NATURALIZATION">NATURALIZATION</option></select></div></div>
              {formData.nationalityBy === 'NATURALIZATION' && (
                <div className={row}><label className={lbl}>Prev. Nationality<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="prevNationality" value={formData.prevNationality || ''} onChange={handleInputChange} className={inp} required><option value="">Select nationality</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
              )}
              <div className={row}>
                <label className={lbl}>Have you lived 2+ years in applying country?<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="livedTwoYears" value="Yes" checked={formData.livedTwoYears === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="livedTwoYears" value="No" checked={formData.livedTwoYears === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4"><Shield className="h-6 w-6" /><h3 className="text-xl font-bold">Passport Details</h3></div>
            <div className="space-y-4 max-w-2xl mx-auto text-sm">
              <div className={row}><label className={lbl}>Passport Number<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="passportNumber" value={formData.passportNumber || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Place of Issue<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="placeOfIssue" value={formData.placeOfIssue || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Date of Issue<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="date" name="dateOfIssue" value={formData.dateOfIssue || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Date of Expiry<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="date" name="dateOfExpiry" value={formData.dateOfExpiry || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}>
                <label className={lbl}>Any other valid Passport?</label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="anyOtherPassport" value="Yes" checked={formData.anyOtherPassport === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="anyOtherPassport" value="No" checked={formData.anyOtherPassport === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                </div>
              </div>
              {formData.anyOtherPassport === 'Yes' && (<>
                <div className={row}><label className={lbl}>Country of Issue<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="otherPassportCountry" value={formData.otherPassportCountry || ''} onChange={handleInputChange} className={inp} required><option value="">Select Country</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
                <div className={row}><label className={lbl}>Passport No.<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="otherPassportNumber" value={formData.otherPassportNumber || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Date of Issue<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="date" name="otherPassportDateOfIssue" value={formData.otherPassportDateOfIssue || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Place of Issue<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="otherPassportPlaceOfIssue" value={formData.otherPassportPlaceOfIssue || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Nationality therein<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="otherPassportNationality" value={formData.otherPassportNationality || ''} onChange={handleInputChange} className={inp} required><option value="">Select Nationality</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
              </>)}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4"><MapPin className="h-6 w-6" /><h3 className="text-xl font-bold">Address Details</h3></div>
            <div className="space-y-4 max-w-2xl mx-auto text-sm">
              <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1">Present Address</h4>
              <div className={row}><label className={lbl}>House No./Street<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="presHouseStreet" value={formData.presHouseStreet || ''} onChange={handleInputChange} className={inp} maxLength={35} required /></div></div>
              <div className={row}><label className={lbl}>Village/Town/City<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="presVillageCity" value={formData.presVillageCity || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Country<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="presCountry" value={formData.presCountry || ''} onChange={handleInputChange} className={inp} required><option value="">Select Country</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
              <div className={row}><label className={lbl}>State/Province<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="presState" value={formData.presState || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Postal/Zip Code<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="presZip" value={formData.presZip || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Phone No.<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="presPhone" value={formData.presPhone || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Mobile No.<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="presMobile" value={formData.presMobile || ''} onChange={handleInputChange} className={inp} placeholder="e.g. 00421915000000" required /></div></div>
              <div className={row}>
                <label className={lbl}>Same as present address</label>
                <div className="md:col-span-2 flex items-center space-x-2"><input type="checkbox" name="sameAddress" checked={formData.sameAddress || false} onChange={handleInputChange} className="w-5 h-5 text-orange-600" /><span className="text-sm">Click for same address</span></div>
              </div>
              <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1 mt-6">Permanent Address</h4>
              <div className={row}><label className={lbl}>House No./Street<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="permHouseStreet" value={formData.permHouseStreet || ''} onChange={handleInputChange} className={inp + (formData.sameAddress ? ' bg-gray-50' : '')} disabled={formData.sameAddress} required /></div></div>
              <div className={row}><label className={lbl}>Village/Town/City</label><div className="md:col-span-2"><input type="text" name="permVillageCity" value={formData.permVillageCity || ''} onChange={handleInputChange} className={inp + (formData.sameAddress ? ' bg-gray-50' : '')} disabled={formData.sameAddress} /></div></div>
              <div className={row}><label className={lbl}>State/Province</label><div className="md:col-span-2"><input type="text" name="permState" value={formData.permState || ''} onChange={handleInputChange} className={inp + (formData.sameAddress ? ' bg-gray-50' : '')} disabled={formData.sameAddress} /></div></div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4"><Users className="h-6 w-6" /><h3 className="text-xl font-bold">Family & Occupation</h3></div>
            <div className="space-y-4 max-w-2xl mx-auto text-sm">
              <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1">Father's Details</h4>
              <div className={row}><label className={lbl}>Name<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="fatherName" value={formData.fatherName || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Nationality<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="fatherNationality" value={formData.fatherNationality || ''} onChange={handleInputChange} className={inp} required><option value="">Select Nationality</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
              <div className={row}><label className={lbl}>Place of birth<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="fatherPlaceOfBirth" value={formData.fatherPlaceOfBirth || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Country of birth<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="fatherCountryOfBirth" value={formData.fatherCountryOfBirth || ''} onChange={handleInputChange} className={inp} required><option value="">Select Country</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
              <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1 mt-6">Mother's Details</h4>
              <div className={row}><label className={lbl}>Name<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="motherName" value={formData.motherName || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Nationality<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="motherNationality" value={formData.motherNationality || ''} onChange={handleInputChange} className={inp} required><option value="">Select Nationality</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
              <div className={row}><label className={lbl}>Place of birth<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="motherPlaceOfBirth" value={formData.motherPlaceOfBirth || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Country of birth<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="motherCountryOfBirth" value={formData.motherCountryOfBirth || ''} onChange={handleInputChange} className={inp} required><option value="">Select Country</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
              <div className="col-span-3 border-t-2 border-gray-300 my-4"></div>
              <div className={row}><label className={lbl}>Applicant's Marital Status<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleInputChange} className={inp} required><option value="">Select Marital Status</option>{MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div></div>
              {formData.maritalStatus === 'MARRIED' && (<>
                <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest border-b border-orange-100 pb-1 mt-4">Spouse's Details</h4>
                <div className={row}><label className={lbl}>Name<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="spouseName" value={formData.spouseName || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Nationality<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="spouseNationality" value={formData.spouseNationality || ''} onChange={handleInputChange} className={inp} required><option value="">Select Nationality</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
                <div className={row}><label className={lbl}>Previous Nationality<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="spousePrevNationality" value={formData.spousePrevNationality || ''} onChange={handleInputChange} className={inp} required><option value="">Select Nationality</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
                <div className={row}><label className={lbl}>Place of birth<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="spousePlaceOfBirth" value={formData.spousePlaceOfBirth || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Country of birth<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="spouseCountryOfBirth" value={formData.spouseCountryOfBirth || ''} onChange={handleInputChange} className={inp} required><option value="">Select Country</option>{NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}</select></div></div>
              </>)}
              <div className={row}>
                <label className={lbl}>Were your parents/grandparents (paternal/maternal) Pakistan Nationals or belong to Pakistan held area?<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="pakistanAncestry" value="Yes" checked={formData.pakistanAncestry === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="pakistanAncestry" value="No" checked={formData.pakistanAncestry === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                </div>
              </div>
              {formData.pakistanAncestry === 'Yes' && (
                <div className={row}><label className={lbl}>Details<span className="text-red-500">*</span></label><div className="md:col-span-2"><textarea name="pakistanDetails" value={formData.pakistanDetails || ''} onChange={handleInputChange} className={inp} rows={2} required /></div></div>
              )}
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider mt-6">Occupation Details</div>
              <div className={row}><label className={lbl}>Present Occupation<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="occupation" value={formData.occupation || ''} onChange={handleInputChange} className={inp} required><option value="">Select Occupation</option>{OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}</select></div></div>
              <div className={row}><label className={lbl}>Employer Name<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="employerName" value={formData.employerName || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Designation<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="employerDesignation" value={formData.employerDesignation || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Address<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="occupationAddress" value={formData.occupationAddress || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}>
                <label className={lbl}>Military/Security Service?<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="militaryService" value="Yes" checked={formData.militaryService === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="militaryService" value="No" checked={formData.militaryService === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                </div>
              </div>
              {formData.militaryService === 'Yes' && (<>
                <div className={row}><label className={lbl}>Organization<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="militaryOrg" value={formData.militaryOrg || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Designation<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="militaryDesignation" value={formData.militaryDesignation || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Rank<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="militaryRank" value={formData.militaryRank || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Place of Posting<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="militaryPosting" value={formData.militaryPosting || ''} onChange={handleInputChange} className={inp} required /></div></div>
              </>)}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4"><Plane className="h-6 w-6" /><h3 className="text-xl font-bold">Travel Details</h3></div>
            <div className="space-y-4 max-w-2xl mx-auto text-sm">
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider">Details of Visa Sought</div>
              <div className={row}><label className={lbl}>Places to be visited<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="placesToBeVisited" value={formData.placesToBeVisited || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Places to be visited (line 2)</label><div className="md:col-span-2"><input type="text" name="placesToBeVisited2" value={formData.placesToBeVisited2 || ''} onChange={handleInputChange} className={inp} /></div></div>
              <div className={row}>
                <label className={lbl}>Hotel booked?</label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="hotelBooked" value="Yes" checked={formData.hotelBooked === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="hotelBooked" value="No" checked={formData.hotelBooked === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                </div>
              </div>
              {formData.hotelBooked === 'Yes' && (
                <div className={row}><label className={lbl}>Hotel address<span className="text-red-500">*</span></label><div className="md:col-span-2"><textarea name="hotelAddress" value={formData.hotelAddress || ''} onChange={handleInputChange} className={inp} rows={2} required /></div></div>
              )}
              <div className={row}><label className={lbl}>Port of Arrival in India</label><div className="md:col-span-2"><span className="font-bold text-gray-800 uppercase bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 block">{formData.portOfArrival || 'NOT SELECTED'}</span></div></div>
              <div className={row}><label className={lbl}>Port of Exit<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="portOfExit" value={formData.portOfExit || ''} onChange={handleInputChange} className={inp} required><option value="">Select exit point</option>{PORTS_OF_EXIT.map(p => <option key={p} value={p}>{p}</option>)}</select></div></div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider mt-4">Previous Visa Details</div>
              <div className={row}>
                <label className={lbl}>Visited India before?<span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visitedIndiaBefore" value="Yes" checked={formData.visitedIndiaBefore === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visitedIndiaBefore" value="No" checked={formData.visitedIndiaBefore === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                </div>
              </div>
              {formData.visitedIndiaBefore === 'Yes' && (<>
                <div className={row}><label className={lbl}>Address<span className="text-red-500">*</span></label><div className="md:col-span-2"><textarea name="visitedIndiaAddress1" value={formData.visitedIndiaAddress1 || ''} onChange={handleInputChange} className={inp} rows={2} required /></div></div>
                <div className={row}><label className={lbl}>Cities previously visited in India<span className="text-red-500">*</span></label><div className="md:col-span-2"><textarea name="citiesVisitedIndia" value={formData.citiesVisitedIndia || ''} onChange={handleInputChange} className={inp} rows={2} required /></div></div>
                <div className={row}><label className={lbl}>Last Indian Visa No/Currently valid Indian Visa No.<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="lastIndianVisaNo" value={formData.lastIndianVisaNo || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Type of Visa<span className="text-red-500">*</span></label><div className="md:col-span-2"><select name="lastVisaType" value={formData.lastVisaType || ''} onChange={handleInputChange} className={inp} required><option value="">Select visa type</option><option>TOURIST</option><option>BUSINESS</option><option>STUDENT</option><option>EMPLOYMENT</option><option>MEDICAL</option><option>CONFERENCE</option><option>TRANSIT</option><option>ENTRY</option><option>OTHER</option></select></div></div>
                <div className={row}><label className={lbl}>Place of Issue<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="lastVisaPlaceOfIssue" value={formData.lastVisaPlaceOfIssue || ''} onChange={handleInputChange} className={inp} required /></div></div>
                <div className={row}><label className={lbl}>Date of Issue<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="date" name="lastVisaDateOfIssue" value={formData.lastVisaDateOfIssue || ''} onChange={handleInputChange} className={inp} required /></div></div>
              </>)}
              <div className={row}>
                <label className={lbl}>Visa previously refused?</label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visaRefused" value="Yes" checked={formData.visaRefused === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visaRefused" value="No" checked={formData.visaRefused === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                </div>
              </div>
              {formData.visaRefused === 'Yes' && (
                <div className={row}><label className={lbl}>If so, when and by whom (Mention Control No. and date also)<span className="text-red-500">*</span></label><div className="md:col-span-2"><textarea name="visaRefusedDetails" value={formData.visaRefusedDetails || ''} onChange={handleInputChange} className={inp} rows={2} required /></div></div>
              )}
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider mt-4">Countries Visited (Last 10 Years)</div>
              <div className={row}>
                <label className={lbl}>Add countries</label>
                <div className="md:col-span-2">
                  <select onChange={(e) => { addCountryVisited(e.target.value); e.target.value = ''; }} className={inp}>
                    <option value="">Select country to add</option>
                    {NATIONALITIES.map(n => <option key={n} value={n.toUpperCase()}>{n.toUpperCase()}</option>)}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(formData.countriesVisited10Years || []).map(c => (
                      <span key={c} className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                        <span>{c}</span>
                        <button type="button" onClick={() => removeCountryVisited(c)}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider mt-4">SAARC Country Visit Details</div>
              <div className={row}>
                <label className={lbl}>Have you visited SAARC countries (except your own country) during past 3 years? <span className="text-gray-500 font-normal">(SAARC - Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan, Sri Lanka)</span><span className="text-red-500">*</span></label>
                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visitedSaarc" value="Yes" checked={formData.visitedSaarc === 'Yes'} onChange={handleInputChange} className="text-orange-600" /><span>Yes</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="visitedSaarc" value="No" checked={formData.visitedSaarc === 'No'} onChange={handleInputChange} className="text-orange-600" /><span>No</span></label>
                </div>
              </div>
              {formData.visitedSaarc === 'Yes' && (
                <SaarcCountryVisits
                  entries={formData.saarcCountries || []}
                  onChange={(entries) => setFormData(d => ({ ...d, saarcCountries: entries }))}
                  inp={inp}
                />
              )}
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider mt-4">Reference in India</div>
              <div className={row}><label className={lbl}>Name<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="refNameIndia" value={formData.refNameIndia || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Address<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="refAddressIndia1" value={formData.refAddressIndia1 || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>State</label><div className="md:col-span-2">
                <select name="refStateIndia" value={formData.refStateIndia || ''} onChange={handleInputChange} className={inp}>
                  <option value="">Select State</option>
                  {Object.keys(INDIA_STATES_DISTRICTS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div></div>
              {formData.refStateIndia && INDIA_STATES_DISTRICTS[formData.refStateIndia] && (
                <div className={row}><label className={lbl}>District</label><div className="md:col-span-2">
                  <select name="refDistrictIndia" value={formData.refDistrictIndia || ''} onChange={handleInputChange} className={inp}>
                    <option value="">Select District</option>
                    {INDIA_STATES_DISTRICTS[formData.refStateIndia].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div></div>
              )}
              <div className={row}><label className={lbl}>Phone<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="refPhoneIndia" value={formData.refPhoneIndia || ''} onChange={handleInputChange} className={inp} placeholder="e.g. 00421915000000" required /></div></div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-wider mt-4">Reference in Home Country</div>
              <div className={row}><label className={lbl}>Name<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="refNameHome" value={formData.refNameHome || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Address<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="refAddressHome1" value={formData.refAddressHome1 || ''} onChange={handleInputChange} className={inp} required /></div></div>
              <div className={row}><label className={lbl}>Phone<span className="text-red-500">*</span></label><div className="md:col-span-2"><input type="text" name="refPhoneHome" value={formData.refPhoneHome || ''} onChange={handleInputChange} className={inp} placeholder="e.g. 00421915000000" required /></div></div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4"><Camera className="h-6 w-6" /><h3 className="text-xl font-bold">Upload Photos</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-bold mb-2">Passport Photo</h4>
                <p className="text-xs text-gray-500 mb-4">White background, recent, JPEG/PNG, max 1MB</p>
                {formData.passportPhoto ? (
                  <div className="relative">
                    <img src={formData.passportPhoto} alt="Passport" className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-orange-300" />
                    <button type="button" onClick={() => setFormData(prev => ({...prev, passportPhoto: ''}))} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <label className="cursor-pointer bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors inline-block">
                    <Upload className="h-4 w-4 inline mr-2" />Upload
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'passportPhoto')} className="hidden" />
                  </label>
                )}
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-bold mb-2">Personal Photo</h4>
                <p className="text-xs text-gray-500 mb-4">Clear face photo, JPEG/PNG, max 1MB</p>
                {formData.personalPhoto ? (
                  <div className="relative">
                    <img src={formData.personalPhoto} alt="Personal" className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-orange-300" />
                    <button type="button" onClick={() => setFormData(prev => ({...prev, personalPhoto: ''}))} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <label className="cursor-pointer bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors inline-block">
                    <Upload className="h-4 w-4 inline mr-2" />Upload
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'personalPhoto')} className="hidden" />
                  </label>
                )}
              </div>
            </div>
            <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <Info className="h-4 w-4 inline mr-2" />
              Photos will be reviewed by our experts. Don't worry if they're not perfect — we'll help you fix any issues before submission.
            </div>
          </div>
        );

      case 8:
        const selectedService = VISA_SERVICES.find(v => v.id === formData.visaService);
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 text-orange-600 mb-4"><CheckCircle className="h-6 w-6" /><h3 className="text-xl font-bold">Review & Payment</h3></div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-bold text-lg mb-4">Application Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Applicant</span><span className="font-semibold">{formData.givenNames} {formData.surname}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Nationality</span><span className="font-semibold">{formData.nationality}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Passport No.</span><span className="font-semibold">{formData.passportNumber}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Visa Type</span><span className="font-semibold">{selectedService?.label}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Arrival Date</span><span className="font-semibold">{formData.expectedArrivalDate}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Email</span><span className="font-semibold">{formData.email}</span></div>
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Service Fee</span>
                    <span className="text-2xl font-bold text-orange-600">{selectedService?.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+ official government fee paid separately upon visa approval</p>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
                <Info className="h-4 w-4 inline mr-2" />
                After payment, your application will be reviewed by our experts within 24 hours. Your eVisa will be sent to <strong>{formData.email}</strong>.
              </div>
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-orange-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <><RefreshCw className="h-5 w-5 animate-spin" /><span>Processing...</span></>
                ) : (
                  <><span>Proceed to Payment — {selectedService?.price}</span><ChevronRight className="h-5 w-5" /></>
                )}
              </button>
              <p className="text-center text-xs text-gray-500">
                🔒 Secure payment via Stripe. Your card details are never stored on our servers.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center flex-shrink-0">
                <div className={`flex flex-col items-center ${step >= s.num ? 'text-orange-600' : 'text-gray-400'}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${step > s.num ? 'bg-orange-600 border-orange-600 text-white' : step === s.num ? 'bg-white border-orange-600 text-orange-600' : 'bg-white border-gray-300 text-gray-400'}`}>
                    {step > s.num ? <CheckCircle className="h-5 w-5" /> : s.num}
                  </div>
                  <span className="text-[10px] mt-1 font-medium hidden sm:block">{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-[2px] w-8 sm:w-12 mx-1 transition-all ${step > s.num ? 'bg-orange-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
            <div className="h-full bg-orange-600 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 7) * 100}%` }} />
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10">
          <form onSubmit={(e) => e.preventDefault()}>
            {renderStep()}
          </form>
        </div>

        {/* Navigation buttons */}
        {step < 8 && (
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-5 w-5" /><span>Previous</span>
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center space-x-2 bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all shadow-md"
            >
              <span>Next Step</span><ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
        {step > 1 && step === 8 && (
          <div className="flex justify-start mt-6">
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              <ChevronLeft className="h-5 w-5" /><span>Previous</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaForm;
