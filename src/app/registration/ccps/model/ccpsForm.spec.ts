import { CCPSForm } from "./ccpsForm";

describe('CCPS Application Form', () => {
    let testCCPSData = {
        activeForm: {
            isOverallDeclarationAcknowledged: false,
            professionalStandingDetail: {
                continueExistingName: null,
                title: null,
                titleValue: null,
                forenames: null,
                surname: null,
                middleName: null,
                country: "Hong Kong",
                regulatoryBodyId: "d7943ed1",
                contactName: null,
                telephone: null,
                emailAddress: null
            },
            initialRegistrantQualificationDetail: {
                registrationRoute: 717750002,
                eeaPharmacistQualificationDetail: null,
                ukPharmacistQualificationDetail: null,
                ospapPharmacistQualificationDetail: {
                    degreeName: null,
                    universityName: null,
                    yearObtained: null,
                    ospapCountryQualified: "Belgium",
                    ospapCourseId: "b3abdaa0",
                    ospapCourseName: "OSPAP Sunderland",
                    ospapDateQualified: null,
                    assessmentYear: null
                },
                irelandPharmacistQualificationDetail: null,
                pharmacyTechnicianQualificationDetail: null,
                trainingDetails: [
                    {
                        id: "317e55a7",
                        trainingSiteName: "Abi Pharmacy",
                        trainingSiteAddress: "51f Beech Avenue,,,NORTHAMPTON,Northamptonshire,UK,NN3 2JG",
                        trainingStartDate: "2007-07-02T00:00:00",
                        trainingEndDate: "2008-06-29T00:00:00"
                    }
                ]
            },
            appDeclaration: {
                isQ1Confirmed: null,
                isQ2Confirmed: null,
                isQ3Confirmed: null,
                isQ4Confirmed: null
            },
            equalityDiversity: {
                ethnicity: 717750007,
                ethnicityOther: null,
                nationality: 717750015,
                religion: null,
                religionOther: null,
                disabled: null,
                disabilityDetails: null,
                gender: null,
                sexualOrientation: null
            },
            declarations: [],
            qualificationDetailsExists: {
                courseExists: true,
                qualifiedExists: false,
                countryExists: true
            },
            trainingDetailsExists: false,
            assessmentDetailsExists: false,
            id: "0c2a0ad9",
            formStatus: 2,
            step: 3,
            scope: 9,
            attachments: [],
            countersignatures: [],
            createdAt: "2023-10-05T11:15:08.927",
            dateApplicationSubmitted: null
        },
        personalDetails: {
            title: {
                name: "Mr",
                id: 717750001
            },
            forenames: "James",
            surname: "CCPS EEA 20",
            middleName: null,
            dateOfBirth: "1977-10-14T00:00:00",
            address: {
                line1: "XYZ",
                line2: null,
                line3: null,
                town: "XYZ",
                county: "XYZ",
                postcode: "XYZ",
                country: "B0",
                homeNation: 717750000,
                latitude: 49.8943,
                longitude: -6.3467,
                countryCode: null
            },
            contact: {
                email: "test@outlook.com",
                telephone1: "123456789",
                mobilePhone: null
            },
            registration: {
                registrationNumber: 123456,
                registrationStatus: 717750008,
                independentPrescriberStatus: 0,
                voluntaryRemovalReason: null,
                registrationRoute: 717750002,
                eeaDirectiveRoute: null,
                legacyRegistrationRoute: null,
                contactType: 717750000,
                isRequiredEnglishCertificate: false,
                isRequiredRevalidationSubmission: false
            },
            otherRegulators: null
        },
        countries: [
            "Hong Kong",
            "Australia",
            "United Kingdom",
            "Switzerland"
        ],
        regulatoryBodies: [
            {
                id: "4afb3c93",
                name: "test1",
                addressLine1: null,
                addressLine2: null,
                addressLine3: null,
                countyState: null,
                country: null,
                postCode: null,
                standardEmail: null
            },
            {
                id: "d7943ed1",
                name: "Pharmacy Board",
                addressLine1: "1st Floor, Shun Feng International Centre",
                addressLine2: "182 Queen’s Road East",
                addressLine3: "Wanchai",
                countyState: null,
                country: "Hong Kong",
                postCode: "Hong Kong",
                standardEmail: "test@test.org"
            }
        ],
        certProfessionalStandingApplicationFee: 81.00
      }

  let testCCPSForm = new CCPSForm(testCCPSData, 717750003);


it('should init correctly', () => {
    expect(testCCPSForm).toBeTruthy();
});

it('application is editable if the formStatus is Inprogress', ()=> {
    expect(testCCPSForm.readonly).toBe(false);
});

});