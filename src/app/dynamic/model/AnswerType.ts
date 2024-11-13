export enum AnswerType {
  Unknown = 0,
  /// <summary>
  /// This Answer represents an alternative out of many. Can be presented as RadioButtons or a DropDown.
  /// </summary>
  Alternative = 1,
  /// <summary>
  /// Typically a CheckBox.
  /// </summary>
  Bool,
  Number = 4,
  Date = 8,
  Time,
  DateTime = 24,
  Email = 32,
  /// <summary>
  /// A TextField around 60 Characters Limit. These are just guidelines though,
  /// and it all comes down to how you decide to store the data.
  /// </summary>
  ShortText = 64,
  /// <summary>
  /// A TextField around 250 Characters Limit. These are just guidelines though,
  /// and it all comes down to how you decide to store the data.
  /// </summary>
  LongText = 128,
  /// <summary>
  /// A TextArea with no Size Limitation (basically varchar(max)). These are just
  /// guidelines though, and it all comes down to how you decide to store the data.
  /// </summary>
  FreeText = 256,
}
