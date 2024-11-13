
export interface FaqCategory {
    name: string;
    questions: Array<FaqQuestion>;
    isOpen: boolean;
}
interface FaqQuestion {
  question: string;
  answer: string;
  isOpen: boolean;
}
