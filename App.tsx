
import React, { useState, useRef, useCallback } from 'react';
import Header from './components/Header';
import DiagnosisResult from './components/DiagnosisResult';
import { diagnoseCropDisease } from './services/geminiService';
import { Diagnosis } from './types';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setDiagnosis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startDiagnosis = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    try {
      const result = await diagnoseCropDisease(selectedImage);
      setDiagnosis(result);
    } catch (err) {
      console.error(err);
      setError("দুঃখিত, রোগটি শনাক্ত করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন। ছবি পরিষ্কার কি না যাচাই করুন।");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setDiagnosis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <section className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-emerald-800 mb-2">আপনার ফসলের ডাক্তার</h2>
          <p className="text-slate-600">আক্রান্ত ফসলের একটি ছবি তুলুন বা আপলোড করুন, আমরা বলে দেব প্রতিকার!</p>
        </section>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-emerald-100">
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-emerald-100 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
            >
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">ছবি আপলোড করুন</h3>
              <p className="text-slate-500">ক্যামেরা দিয়ে ছবি তুলুন অথবা গ্যালারি থেকে নির্বাচন করুন</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-inner bg-slate-100 border border-slate-200">
                <img 
                  src={selectedImage} 
                  alt="Selected Crop" 
                  className="w-full max-h-[400px] object-contain mx-auto"
                />
                {!loading && !diagnosis && (
                  <button 
                    onClick={reset}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {!diagnosis && (
                <div className="flex flex-col items-center">
                  <button 
                    onClick={startDiagnosis}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center gap-3"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        শনাক্ত করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        রোগ শনাক্ত করুন
                      </>
                    )}
                  </button>
                  {loading && (
                    <p className="text-emerald-600 mt-4 animate-pulse">আমাদের বিশেষজ্ঞ এআই শস্যটি পরীক্ষা করছে, দয়া করে অপেক্ষা করুন...</p>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {diagnosis && (
          <div className="space-y-6">
            <DiagnosisResult diagnosis={diagnosis} />
            <div className="flex justify-center">
              <button 
                onClick={reset}
                className="text-emerald-600 font-semibold border-2 border-emerald-600 px-6 py-2 rounded-full hover:bg-emerald-50 transition-colors"
              >
                অন্য ছবি পরীক্ষা করুন
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© ২০২৪ বাংলার কৃষিবিদ - আপনার বিশ্বস্ত ডিজিটাল কৃষি সঙ্গী</p>
          <div className="mt-4 flex justify-center gap-4 text-slate-400">
             <span className="text-xs">নিরাপদ খাদ্য</span>
             <span className="text-xs">উন্নত চাষাবাদ</span>
             <span className="text-xs">ডিজিটাল বাংলাদেশ</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
