import { Component } from "@angular/core";
import { VoluntaryRemovalApplication } from "./VoluntaryRemovalApplication";
import { VoluntaryRemovalApplicationForm } from "./VoluntaryRemovalApplicationForm";

describe('Voluntary removal model', () => {
let testVoluntaryRemovalData = {
    'form': {
        'voluntaryRemovalDetails': {
          'dateOfRegistryRemoval': '2022-07-31T00:00:00',
          'reasonForRemoval': 'Retirement',
          'reasonForRemovalDetails': null
        },
        'appDeclaration': {
          'isQ1Confirmed': true,
          'isQ2Confirmed': true
        },
        'equalityDiversity': {
          'ethnicity': 717750017,
          'ethnicityOther': '',
          'nationality': 717750031,
          'religion': 717750000,
          'religionOther': '',
          'disabled': 717750001,
          'disabilityDetails': '',
          'gender': 981360001,
          'sexualOrientation': 981360005
        },
        'ftpDeclarations': [
          {
            'dynamicFormId': 'a6805c30-53d8-470a-9b82-7d89cb9809ab',
            'answers': [
              {
                'questionId': 'b2bc2137-3f78-4b8e-920b-6317b6406a21',
                'answer': 'e2613f1e-8bdd-45fc-8ef8-085d2328a4fe',
                'answerText': 'Yes'
              },
              {
                'questionId': 'bd0d8568-e54d-4b25-8dc2-5bb9a84c9260',
                'answer': '10aa02b2-de8c-4829-97a9-7215f325325d',
                'answerText': 'Yes'
              },
              {
                'questionId': '820c005b-e672-4b3f-9574-8e26f5a71a72',
                'answer': '0718d8bc-e5ac-496a-a24a-35514844ce05',
                'answerText': 'Yes'
              },
              {
                'questionId': '7fb659fe-6e43-4891-b51a-83f2d594099c',
                'answer': 'f3ddc44f-f73e-4765-b16c-8fe848d7662e',
                'answerText': 'Yes'
              },
              {
                'questionId': '82305608-4123-44c2-96c1-6aeefdfd2765',
                'answer': 'd5165beb-94fc-4faa-b82c-d96ceadba522',
                'answerText': 'Yes'
              },
              {
                'questionId': 'cc87c4e4-50e3-4758-8388-afac37509ccb',
                'answer': '6679dff8-4014-480c-bff3-1f66d05a0fef',
                'answerText': 'Yes'
              },
              {
                'questionId': 'cea685b1-3315-4c06-9883-708866f6ad26',
                'answer': '5c0c62ab-bf09-40bb-870d-97df36a14fd9',
                'answerText': 'Yes'
              },
              {
                'questionId': '3bfed8da-b2da-478a-9f37-8f1d82eddedb',
                'answer': '830d594a-8bd4-470d-95bb-99f9c6948598',
                'answerText': 'Yes'
              },
              {
                'questionId': '5756552e-2ea7-4ecd-8d49-1350c1f75327',
                'answer': '3abf764c-3d3f-4ef1-8882-30065a5df2d5',
                'answerText': 'Yes'
              },
              {
                'questionId': 'c2f03300-e0cb-4d23-a6d8-d51a0b785aad',
                'answer': 'b6a72f2c-d1a4-40a2-b1f8-56c07cf30f55',
                'answerText': 'Yes'
              },
              {
                'questionId': '6e589c86-b513-4de6-8f88-a224601989ef',
                'answer': 'b568dadf-4beb-4ef4-821d-a97d59ac260c',
                'answerText': 'Yes'
              },
              {
                'questionId': '9abd6118-57f5-4660-a458-5490121906b7',
                'answer': 'c0db1bc7-1797-4202-b04a-8836f49c25e8',
                'answerText': 'Yes'
              },
              {
                'questionId': '9879fc4a-d2af-4423-82eb-8bd4ceae299f',
                'answer': '21262503-da43-421c-b72f-721660d355f1',
                'answerText': 'Yes'
              },
              {
                'questionId': '308a585e-7cf2-42bd-a4d8-55085365f252',
                'answer': 'f8359129-e045-4869-9b41-11cfe01c932e',
                'answerText': 'Yes'
              }
            ]
          }
        ],
        'id': '6d62f267-8197-4bca-88d2-7aa8dc3d0dbc',
        'formStatus': 3,
        'step': 6,
        'scope': 7,
        'attachments': [],
        'countersignatures': [],
        'createdAt': '2022-06-17T08:40:58.247',
        'dateApplicationSubmitted': '2022-06-29T06:44:43.22'
      },
      'pendingFee': 0,
      'outstandingPayments': null

};

    let testVoluntaryRemovalForm = new VoluntaryRemovalApplicationForm(testVoluntaryRemovalData, 717750003);


it('should init correctly', () => {
    expect(testVoluntaryRemovalForm).toBeTruthy();
});

});