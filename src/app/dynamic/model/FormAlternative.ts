import { FormQuestion } from './FormQuestion';

export interface FormAlternative {
  id: string;

  /// A clean string that can be used as a name in HTML for instance, or an ID in
  /// the database. Good names: "yes", "is-known". Bad names: "GPhC 'knows'!".
  name: string;

  /// The text to display in the UI. Good display text: "Yes", "Is Known".
  /// Bad display text: "is-known".
  text: string;

  /// This is used to sort the answers when getting the form out of the database.
  order: number;

  /// Questions that should be visible if this alternative is selected.
  questions: Array<FormQuestion>;

  /// If this answer is the only alternative that's acceptable set it to true.
  /// Ie. "Do you accept these terms and conditions? Yes/No". If they don't click
  /// yes they won't be able to proceed, and then IsRequired should be true.
  /// For the other AnswerTypes this shows if the field is required.
  isRequired: boolean;

  /// If this is true this alternative should trigger the UI to show additional
  /// information. Tihs is used for the RenewalDeclarations to prompt for further
  /// declarations.
  showAdditionalInfo: boolean;

  ///https://mygphc.atlassian.net/browse/NWU-1
  ///Declaration reference number
  referenceNumber:string;
}
