
export interface Diagnosis {
  diseaseName: string;
  cropName: string;
  symptoms: string[];
  remedyOrganic: string;
  remedyChemical: string;
  preventiveMeasures: string[];
  rawText?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  diagnosis?: Diagnosis;
}
