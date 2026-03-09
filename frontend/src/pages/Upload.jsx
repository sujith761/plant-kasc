import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { searchDisease, addPrediction } from '../firebase';
import { predictDisease } from '../utils/aiApi';
import { getDiseaseByClass } from '../data/diseaseDatabase';
import {
  Search,
  Sprout,
  Loader2,
  ChevronRight,
  Database,
  Info,
  CheckCircle2,
  Sparkles,
  Upload as UploadIcon,
  Camera,
  Image as ImageIcon,
  X,
  Zap,
  ShieldCheck,
  Brain,
  ArrowRight,
} from 'lucide-react';
import { plantTypes, diseasesByPlant } from '../data/diseaseDatabase';

// ─── Tab IDs ───
const TAB_SCANNER = 'scanner';
const TAB_ENCYCLOPEDIA = 'encyclopedia';

const Upload = () => {
  const navigate = useNavigate();

  // ─── Shared ───
  const [activeTab, setActiveTab] = useState(TAB_SCANNER);

  // ─── Encyclopedia state ───
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [searching, setSearching] = useState(false);

  // ─── AI Scanner state ───
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // ─── Encyclopedia handlers (unchanged) ───
  const handleSearchDisease = async () => {
    if (!selectedDisease) {
      toast.error('Please select a plant and disease');
      return;
    }
    setSearching(true);
    try {
      const result = await searchDisease(selectedDisease);
      if (result.success) {
        const saveResult = await addPrediction({
          plantType: result.data.plant || selectedPlant,
          predictedDisease: result.data.disease || selectedDisease.replace(/_/g, ' '),
          confidence: 100,
          severity: result.data.severity || 'medium',
          description: result.data.description || '',
          treatment: Array.isArray(result.data.remedies) ? result.data.remedies.join('; ') : (result.data.remedies || ''),
          prevention: Array.isArray(result.data.prevention) ? result.data.prevention.join('; ') : (result.data.prevention || ''),
        });
        if (saveResult.success) console.log('Saved to history:', saveResult.id);
        else toast.warning('Analysis loaded but could not save to history');
        navigate('/disease-info', { state: { diseaseInfo: result.data } });
      } else {
        toast.error(result.message || 'Failed to fetch disease information');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to fetch disease information');
    } finally {
      setSearching(false);
    }
  };

  const handlePlantChange = (e) => {
    setSelectedPlant(e.target.value);
    setSelectedDisease('');
  };

  // ─── AI Scanner handlers ───
  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Please upload a valid image (PNG, JPG, GIF, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragActive(false), []);

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleScanImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setScanning(true);
    setScanProgress('Running AI analysis…');

    try {
      // 1. Send image to AI model API for prediction (fast path first)
      const prediction = await predictDisease(selectedFile);

      // 2. Use the image URL returned by the AI API (stored on Flask server)
      const aiApiBase = import.meta.env.VITE_AI_API_URL || 'http://localhost:5001';
      let imageUrl = null;
      if (prediction.image_url) {
        imageUrl = `${aiApiBase}${prediction.image_url}`;
      } else {
        // Fallback: convert file to a base64 data URL (blob URLs die on navigation)
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(selectedFile);
        });
      }

      if (!prediction.success) {
        toast.error(prediction.error || 'AI prediction failed');
        return;
      }

      setScanProgress('Looking up disease details…');

      // 3. Try to enrich with local disease database
      const diseaseClass = prediction.disease_class || '';
      const localData = getDiseaseByClass(diseaseClass);

      // Build the disease info object (merge AI prediction + local DB)
      const diseaseInfo = localData
        ? {
            ...localData,
            confidence: prediction.confidence,
            imageUrl,
            top_predictions: prediction.top_predictions,
            ai_source: true,
          }
        : {
            plant: prediction.plant_type,
            disease: prediction.disease,
            disease_class: diseaseClass,
            confidence: prediction.confidence,
            severity: prediction.severity,
            description: `AI detected ${prediction.disease} on ${prediction.plant_type} with ${prediction.confidence.toFixed(1)}% confidence.`,
            symptoms: [],
            causes: [],
            remedies: [],
            prevention: [],
            imageUrl,
            top_predictions: prediction.top_predictions,
            ai_source: true,
          };

      // 4. Save to Firestore history
      setScanProgress('Saving to history…');
      const saveResult = await addPrediction({
        plantType: diseaseInfo.plant || prediction.plant_type,
        predictedDisease: diseaseInfo.disease || prediction.disease,
        confidence: prediction.confidence,
        severity: diseaseInfo.severity || prediction.severity || 'medium',
        description: diseaseInfo.description || '',
        treatment: Array.isArray(diseaseInfo.remedies) ? diseaseInfo.remedies.join('; ') : '',
        prevention: Array.isArray(diseaseInfo.prevention) ? diseaseInfo.prevention.join('; ') : '',
        imageUrl,
      });

      if (saveResult.success) console.log('Prediction saved:', saveResult.id);
      else console.warn('Could not save to history');

      // 5. Navigate to results page
      toast.success(`Detected: ${diseaseInfo.disease} (${prediction.confidence.toFixed(1)}%)`);
      navigate('/disease-info', { state: { diseaseInfo } });
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to analyse image. Is the AI server running?');
    } finally {
      setScanning(false);
      setScanProgress('');
    }
  };

  // ─── Render ───
  return (
    <div className="pt-32 pb-20 overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 font-bold text-sm mb-6 uppercase tracking-widest shadow-sm"
          >
            <Brain className="w-4 h-4" />
            AI-Powered Plant Analysis
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Plant <span className="text-gradient">Doctor</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Upload a photo of your plant leaf for instant AI diagnosis, or browse our encyclopaedia of 38+ diseases.
          </motion.p>
        </div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setActiveTab(TAB_SCANNER)}
            className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
              activeTab === TAB_SCANNER
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                : 'bg-white text-slate-500 border-2 border-slate-100 hover:border-teal-200 hover:text-teal-600'
            }`}
          >
            <Camera className="w-4 h-4" />
            AI Scanner
          </button>
          <button
            onClick={() => setActiveTab(TAB_ENCYCLOPEDIA)}
            className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
              activeTab === TAB_ENCYCLOPEDIA
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                : 'bg-white text-slate-500 border-2 border-slate-100 hover:border-teal-200 hover:text-teal-600'
            }`}
          >
            <Database className="w-4 h-4" />
            Encyclopedia
          </button>
        </motion.div>

        {/* ──────────── AI SCANNER TAB ──────────── */}
        <AnimatePresence mode="wait">
          {activeTab === TAB_SCANNER && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-5 gap-12 items-start">
                {/* Upload Area */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="card-premium p-10">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                        <Camera className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 leading-none">AI Scanner</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Upload &rarr; Analyse &rarr; Diagnose</p>
                      </div>
                    </div>

                    {/* Drop Zone */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => !selectedFile && fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden ${
                        dragActive
                          ? 'border-teal-500 bg-teal-50 scale-[1.02]'
                          : selectedFile
                          ? 'border-teal-300 bg-teal-50/30'
                          : 'border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/20'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                      />

                      {previewUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Selected plant"
                            className="w-full h-72 object-cover rounded-3xl"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFile();
                            }}
                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-xl shadow-lg hover:bg-red-50 transition-colors"
                          >
                            <X className="w-5 h-5 text-red-500" />
                          </button>
                          <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur rounded-xl shadow-lg">
                            <p className="text-sm font-bold text-slate-700 truncate max-w-[250px]">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {(selectedFile.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-8">
                          <div className="w-20 h-20 bg-teal-100 rounded-3xl flex items-center justify-center mb-6">
                            <UploadIcon className="w-10 h-10 text-teal-500" />
                          </div>
                          <p className="text-xl font-black text-slate-700 mb-2">
                            Drop your plant image here
                          </p>
                          <p className="text-slate-400 font-medium text-sm mb-6">
                            or click to browse &middot; PNG, JPG, WEBP &middot; Max 5 MB
                          </p>
                          <button
                            type="button"
                            className="px-6 py-3 bg-teal-500 text-white rounded-2xl font-bold text-sm hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20 flex items-center gap-2"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Choose Image
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Analyse Button */}
                    <AnimatePresence>
                      {selectedFile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mt-8"
                        >
                          <button
                            onClick={handleScanImage}
                            disabled={scanning}
                            className="w-full btn-premium py-5 text-xl flex items-center justify-center gap-3 overflow-hidden"
                          >
                            {scanning ? (
                              <>
                                <Loader2 className="animate-spin w-6 h-6" />
                                {scanProgress || 'Analysing…'}
                              </>
                            ) : (
                              <>
                                <Zap className="w-6 h-6" />
                                Analyse with AI
                              </>
                            )}
                          </button>
                          {scanning && (
                            <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: '90%' }}
                                transition={{ duration: 8, ease: 'easeOut' }}
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Side Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="card-premium border-none bg-slate-900 text-white p-8 overflow-hidden relative">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-500 rounded-xl">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-black">How It Works</h4>
                      </div>
                      <ol className="space-y-4">
                        {[
                          { step: '1', text: 'Upload a clear photo of the affected leaf' },
                          { step: '2', text: 'Our MobileNetV2 neural network analyses the image' },
                          { step: '3', text: 'Get instant disease identification with confidence score' },
                          { step: '4', text: 'View detailed remedies and prevention tips' },
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                              {item.step}
                            </span>
                            <span className="text-slate-400 font-medium text-sm leading-relaxed">
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
                  </div>

                  <div className="card-premium border-teal-100 bg-teal-50/20 p-8">
                    <ShieldCheck className="w-10 h-10 text-teal-600 mb-4" />
                    <h4 className="text-lg font-black text-slate-800 mb-2">Tips for Best Results</h4>
                    <ul className="space-y-2 text-sm text-slate-500 font-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        Use a clear, well-lit photo
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        Focus on the affected leaf area
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        Avoid blurry or dark images
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        Single leaf per photo works best
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ──────────── ENCYCLOPEDIA TAB ──────────── */}
          {activeTab === TAB_ENCYCLOPEDIA && (
            <motion.div
              key="encyclopedia"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-5 gap-12 items-start">
                {/* Discovery Tool */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="card-premium p-10">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                        <Search className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 leading-none">Discovery Tool</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Global Database Access</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Plant Type Selection */}
                      <div className="relative">
                        <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">
                          Target Organism
                        </label>
                        <select
                          value={selectedPlant}
                          onChange={handlePlantChange}
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-300 font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                          <option value="">Select a plant species...</option>
                          {plantTypes.map((plant) => (
                            <option key={plant} value={plant}>
                              {plant}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-6 bottom-4 pointer-events-none text-slate-400">
                          <ChevronRight className="rotate-90" />
                        </div>
                      </div>

                      {/* Disease Selection */}
                      <AnimatePresence>
                        {selectedPlant && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative"
                          >
                            <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">
                              Specific Condition
                            </label>
                            <select
                              value={selectedDisease}
                              onChange={(e) => setSelectedDisease(e.target.value)}
                              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-300 font-bold text-slate-700 appearance-none cursor-pointer"
                            >
                              <option value="">Identify the disease...</option>
                              {diseasesByPlant[selectedPlant]?.map((item) => (
                                <option key={item.class} value={item.class}>
                                  {item.disease}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-6 bottom-4 pointer-events-none text-slate-400">
                              <ChevronRight className="rotate-90" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Search Action */}
                      <AnimatePresence>
                        {selectedDisease && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="pt-4"
                          >
                            <button
                              onClick={handleSearchDisease}
                              disabled={searching}
                              className="w-full btn-premium py-5 text-xl flex items-center justify-center gap-3 overflow-hidden"
                            >
                              {searching ? (
                                <>
                                  <Loader2 className="animate-spin w-6 h-6" />
                                  Mapping Pathology...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-6 h-6" />
                                  Uncover Detailed Insights
                                </>
                              )}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Side Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="card-premium border-none bg-slate-900 text-white p-8 overflow-hidden relative">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-500 rounded-xl">
                          <Info className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-black">Archive Specs</h4>
                      </div>
                      <ul className="space-y-4">
                        {[
                          'Scientific nomenclature',
                          'High-resolution symptoms guide',
                          'Curated remedial protocols',
                          'Biosecurity & prevention',
                          'Chemical & organic controls',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-400 font-medium text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
                  </div>

                  <div className="card-premium border-teal-100 bg-teal-50/20 p-8">
                    <Sprout className="w-10 h-10 text-teal-600 mb-6" />
                    <h4 className="text-xl font-black text-slate-800 mb-3">AI Image Scanning</h4>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                      Don&apos;t know the name of the disease? Use our neural scanner for instant visual diagnosis.
                    </p>
                    <button
                      onClick={() => setActiveTab(TAB_SCANNER)}
                      className="w-full btn-premium-outline py-3 text-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      Switch to AI Scanner
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-teal-50/30 to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl" />
    </div>
  );
};

export default Upload;

