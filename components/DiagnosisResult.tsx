
import React from 'react';
import { Diagnosis } from '../types';

interface Props {
  diagnosis: Diagnosis;
}

const DiagnosisResult: React.FC<Props> = ({ diagnosis }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100 animate-fade-in">
      <div className="bg-emerald-600 p-4 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          রোগ শনাক্তকরণ ফলাফল
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-4 rounded-xl">
            <span className="text-emerald-700 text-sm font-semibold block mb-1">রোগের নাম</span>
            <p className="text-lg font-bold text-emerald-900">{diagnosis.diseaseName}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl">
            <span className="text-emerald-700 text-sm font-semibold block mb-1">আক্রান্ত ফসল</span>
            <p className="text-lg font-bold text-emerald-900">{diagnosis.cropName}</p>
          </div>
        </div>

        <div>
          <h3 className="text-emerald-800 font-bold mb-3 flex items-center gap-2 border-b border-emerald-100 pb-2">
            <span className="bg-emerald-100 p-1 rounded-md">📋</span> রোগের লক্ষণসমূহ
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            {diagnosis.symptoms.map((symptom, idx) => (
              <li key={idx} className="leading-relaxed">{symptom}</li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-green-800 font-bold flex items-center gap-2 border-b border-green-100 pb-2">
              <span className="bg-green-100 p-1 rounded-md">🌿</span> জৈব প্রতিকার
            </h3>
            <p className="text-slate-700 leading-relaxed bg-green-50/50 p-3 rounded-lg border border-green-100">
              {diagnosis.remedyOrganic}
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-red-800 font-bold flex items-center gap-2 border-b border-red-100 pb-2">
              <span className="bg-red-100 p-1 rounded-md">🧪</span> রাসায়নিক প্রতিকার
            </h3>
            <p className="text-slate-700 leading-relaxed bg-red-50/50 p-3 rounded-lg border border-red-100">
              {diagnosis.remedyChemical}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-blue-800 font-bold mb-3 flex items-center gap-2 border-b border-blue-100 pb-2">
            <span className="bg-blue-100 p-1 rounded-md">🛡️</span> প্রতিরোধমূলক ব্যবস্থা
          </h3>
          <div className="grid md:grid-cols-2 gap-2">
            {diagnosis.preventiveMeasures.map((measure, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-blue-50/30 p-2 rounded-md">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-slate-700 text-sm">{measure}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;
