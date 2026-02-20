export interface VisaApplication {
  // Step 1: Basic Info
  nationality: string;
  passportType: string;
  portOfArrival: string;
  dateOfBirth: string;
  email: string;
  reEnteredEmail: string;
  visaService: string;
  expectedArrivalDate: string;

  // Step 2: Personal Details
  surname: string;
  givenNames: string;
  changedName: boolean;
  prevSurname: string;
  prevGivenNames: string;
  gender: string;
  townOfBirth: string;
  countryOfBirth: string;
  idNumber: string;
  religion: string;
  visibleMarks: string;
  educationalQualification: string;
  collegeQualification: string;
  nationalityBy: string;
  prevNationality: string;
  livedTwoYears: string;

  // Step 3: Passport Details
  passportNumber: string;
  placeOfIssue: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  anyOtherPassport: 'Yes' | 'No';
  otherPassportCountry: string;
  otherPassportNumber: string;
  otherPassportDateOfIssue: string;
  otherPassportPlaceOfIssue: string;
  otherPassportNationality: string;

  // Step 4: Address
  presHouseStreet: string;
  presVillageCity: string;
  presCountry: string;
  presState: string;
  presZip: string;
  presPhone: string;
  presMobile: string;
  sameAddress: boolean;
  permHouseStreet: string;
  permVillageCity: string;
  permState: string;

  // Step 5: Family & Occupation
  fatherName: string;
  fatherNationality: string;
  fatherPrevNationality: string;
  fatherPlaceOfBirth: string;
  fatherCountryOfBirth: string;
  motherName: string;
  motherNationality: string;
  motherPrevNationality: string;
  motherPlaceOfBirth: string;
  motherCountryOfBirth: string;
  maritalStatus: string;
  spouseName: string;
  spouseNationality: string;
  spousePrevNationality: string;
  spousePlaceOfBirth: string;
  spouseCountryOfBirth: string;
  pakistanAncestry: 'Yes' | 'No';
  pakistanDetails: string;
  occupation: string;
  employerName: string;
  employerDesignation: string;
  occupationAddress: string;
  occupationPhone: string;
  pastOccupation: string;
  militaryService: 'Yes' | 'No';
  militaryOrg: string;
  militaryDesignation: string;
  militaryRank: string;
  militaryPosting: string;

  // Step 6: Travel Details
  placesToBeVisited: string;
  placesToBeVisited2: string;
  hotelBooked: 'Yes' | 'No';
  portOfExit: string;
  visitedIndiaBefore: 'Yes' | 'No';
  visitedIndiaDetails: string;
  visaRefused: 'Yes' | 'No';
  visaRefusedDetails: string;
  countriesVisited10Years: string[];
  visitedSaarc: 'Yes' | 'No';
  visitedSaarcDetails: string;
  refNameIndia: string;
  refAddressIndia1: string;
  refAddressIndia2: string;
  refStateIndia: string;
  refDistrictIndia: string;
  refPhoneIndia: string;
  refNameHome: string;
  refAddressHome1: string;
  refAddressHome2: string;
  refPhoneHome: string;

  // Step 7: Files (Base64)
  passportPhoto: string;
  personalPhoto: string;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
