
export interface VisaApplication {
  // Step 1: Basic Info
  nationality: string;
  passportType: string;
  portOfArrival: string;
  visaService: string;
  email: string;

  // Step 2: Personal Details
  surname: string;
  givenNames: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  countryOfBirth: string;
  citizenshipIdNumber: string;
  religion: string;
  visibleIdentificationMarks: string;
  educationalQualification: string;

  // Step 3: Passport Details
  passportNumber: string;
  placeOfIssue: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  anyOtherPassport: 'Yes' | 'No';

  // Step 4: Family & Occupation
  fatherName: string;
  fatherNationality: string;
  motherName: string;
  motherNationality: string;
  maritalStatus: string;
  occupation: string;
  employerName: string;
  employerDesignation: string;

  // Step 5: Travel Details
  presentAddress: string;
  permanentAddress: string;
  placesVisitedInLast10Years: string;
  saarcCountriesVisited: string;
  referenceInIndia: string;
  referenceAddressIndia: string;
  referenceInHomeCountry: string;
  referenceAddressHome: string;

  // Step 6: Files (Base64)
  passportPhoto: string;
  personalPhoto: string;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
