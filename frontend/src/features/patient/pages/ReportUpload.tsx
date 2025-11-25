import { useState, useRef, useEffect } from 'react';
import { getStoredUser } from '../../../services/auth.service';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Loader2,
  Scan,
  AlertCircle,
  Activity,
  Calendar,
  File,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

// --- Interfaces (Kept same as logic) ---
interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  category: string;
  date: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
  fileObj?: File;
}

interface ReportMeta {
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  notes?: string;
  uploadedAt: string;
}

interface Analysis {
  report_type: string;
  findings: Array<{
    parameter: string;
    value: string;
    normal_range: string;
    status: string;
  }>;
  summary: string;
  recommendations: string[];
  concerns: string[];
  disclaimer: string;
}

interface SavedReport {
  _id: string;
  userId: string;
  reportMeta: ReportMeta;
  analysis: Analysis;
  createdAt: string;
  updatedAt: string;
}

const ReportUploadComponent = () => {
  const userProfile = getStoredUser();
  const userId = userProfile?.id || 'demo-user-id';

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [aiResult, setAiResult] = useState<{ reportMeta: ReportMeta; analysis: Analysis } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [myReports, setMyReports] = useState<SavedReport[]>([]);
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('lab-report');
  const [notes, setNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'lab-report', label: 'Lab Report', icon: Activity },
    { value: 'prescription', label: 'Prescription', icon: FileText },
    { value: 'imaging', label: 'X-Ray / MRI', icon: ImageIcon },
    { value: 'consultation', label: 'Consultation Note', icon: File },
    { value: 'other', label: 'Other Document', icon: File },
  ];

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/user/${userId}`);
      setMyReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      setMyReports([]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) handleFiles(Array.from(e.dataTransfer.files));
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = (fileList: File[]) => {
    setAiResult(null);
    setSaveStatus('idle');
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      category: selectedCategory,
      date: new Date().toLocaleDateString(),
      status: 'uploading',
      progress: 0,
      fileObj: file
    }));
    setFiles(newFiles);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setAiResult(null);
  };

  const analyzeReport = async () => {
    if (!files.length) return;
    const file = files[0];
    setIsAnalyzing(true);
    setSaveStatus('idle');
    setAiResult(null);
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'processing' } : f));

    try {
      const formData = new FormData();
      formData.append('file', file.fileObj as File);
      formData.append('document_type', selectedCategory);
      formData.append('notes', notes);

      const res = await axios.post('/ai/report-analyze', formData, {
        baseURL: 'http://localhost:8000',
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setAiResult({ reportMeta: res.data.reportMeta, analysis: res.data.analysis });
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f));
    } catch (err) {
      console.error(err);
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'error' } : f));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveReport = async () => {
    if (!aiResult || !aiResult.reportMeta) return;
    setSaveStatus('saving');
    try {
      const payload = {
        userId,
        ...aiResult.reportMeta,
        analysis: aiResult.analysis ?? {},
      };
      await axios.post('http://localhost:5000/api/reports', payload);
      setSaveStatus('saved');
      fetchMyReports();
    } catch (err) {
      setSaveStatus('error');
    }
  };

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'low': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'normal': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
            <Activity className="w-4 h-4" />
            <span>Health Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Medical Report Analysis
          </h1>
          <p className="text-slate-500 max-w-2xl text-lg">
            Upload your lab results or medical documents. Our AI extracts data, identifies anomalies, and creates a secure digital record.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* --- LEFT COLUMN (Main Content) --- */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. Upload Card */}
            <Card className="border-0 shadow-lg ring-1 ring-slate-200 overflow-hidden bg-white">
              <CardHeader className="bg-white border-b border-slate-100 pb-6">
                <CardTitle className="text-xl">Upload Document</CardTitle>
                <CardDescription>Select the document type and add context for better AI accuracy.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Document Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:ring-indigo-500">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c.value} value={c.value} className="cursor-pointer">
                            <div className="flex items-center gap-2.5">
                              <c.icon className="w-4 h-4 text-indigo-500" />
                              <span className="font-medium">{c.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Notes (Optional)</Label>
                    <Input
                      className="h-11 bg-slate-50 border-slate-200 focus:ring-indigo-500"
                      placeholder="e.g. Dr. Smith annual checkup"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-out
                    flex flex-col items-center justify-center py-12 px-6
                    ${isDragging
                      ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                      : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                    }
                  `}
                >
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileInput} accept=".pdf,.jpg,.jpeg,.png" />

                  <div className={`
                    p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110
                    ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}
                  `}>
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-lg font-semibold text-slate-700">
                      Click to upload <span className="text-indigo-600">or drag and drop</span>
                    </p>
                    <p className="text-sm text-slate-400">PDF, JPG or PNG (Max 10MB)</p>
                  </div>
                </div>

                {/* File Preview & Actions */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {files.map((file) => (
                        <div key={file.id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-4">
                          {file.status === 'processing' && (
                            <motion.div
                              className="absolute bottom-0 left-0 h-1 bg-indigo-500 z-10"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <div className="h-12 w-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{file.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span>{file.size}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className={`capitalize font-medium ${file.status === 'error' ? 'text-red-500' : 'text-indigo-600'}`}>
                                {file.status === 'processing' ? 'Processing...' : file.status}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}

                      {!aiResult && (
                        <Button
                          onClick={analyzeReport}
                          disabled={isAnalyzing}
                          className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.99]"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Report via AI...
                            </>
                          ) : (
                            <>
                              <Scan className="w-5 h-5 mr-2" /> Start Analysis
                            </>
                          )}
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* 2. Analysis Results */}
            {aiResult && aiResult.reportMeta && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-slate-200">
                  <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider font-semibold">AI Analysis Complete</span>
                      </div>
                      <h2 className="text-2xl font-bold">{aiResult.analysis.report_type}</h2>
                      <p className="text-slate-300 text-sm mt-1">{aiResult.reportMeta.fileName}</p>
                    </div>
                    <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-0">
                      New
                    </Badge>
                  </div>

                  <CardContent className="p-0">
                    <div className="p-6 bg-indigo-50/30 border-b border-indigo-100">
                      <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wide mb-2">Executive Summary</h3>
                      <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                        {aiResult.analysis.summary}
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Scan className="w-5 h-5 text-indigo-500" />
                          Extracted Findings
                        </h3>
                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="px-4 py-3 font-semibold text-slate-700">Parameter</th>
                                <th className="px-4 py-3 font-semibold text-slate-700">Value</th>
                                <th className="px-4 py-3 font-semibold text-slate-700 hidden sm:table-cell">Reference Range</th>
                                <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {aiResult.analysis.findings.map((f, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="px-4 py-3 font-medium text-slate-900">{f.parameter}</td>
                                  <td className="px-4 py-3 text-slate-700">{f.value}</td>
                                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell text-xs">{f.normal_range}</td>
                                  <td className="px-4 py-3">
                                    <Badge variant="outline" className={`${getStatusColor(f.status)} border shadow-none font-semibold`}>
                                      {f.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                          <h4 className="flex items-center gap-2 font-bold text-emerald-900 mb-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {aiResult.analysis.recommendations.map((rec, i) => (
                              <li key={i} className="flex gap-2 text-sm text-emerald-800/80 leading-snug">
                                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-400 shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-xl border border-red-100 bg-red-50/50 p-5">
                          <h4 className="flex items-center gap-2 font-bold text-red-900 mb-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            Areas of Concern
                          </h4>
                          {aiResult.analysis.concerns.length > 0 ? (
                            <ul className="space-y-2">
                              {aiResult.analysis.concerns.map((con, i) => (
                                <li key={i} className="flex gap-2 text-sm text-red-800/80 leading-snug">
                                  <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-red-400 shrink-0" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-slate-500 italic">No specific concerns identified.</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-400 italic max-w-md">
                          * AI generated summary. Please consult with a healthcare provider for medical advice.
                          {aiResult.analysis.disclaimer}
                        </p>
                        <Button
                          onClick={saveReport}
                          disabled={saveStatus !== 'idle'}
                          size="lg"
                          className={`min-w-[160px] ${saveStatus === 'saved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                        >
                          {saveStatus === 'saving' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          {saveStatus === 'saved' ? 'Saved Successfully' : 'Save to History'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 3. History Section */}
            <div className="pt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                Recent Reports
              </h3>

              {myReports.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-medium">No reports yet</h4>
                  <p className="text-slate-500 text-sm mt-1">Upload your first document to get started</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {myReports.map((r) => (
                    <Card key={r._id} className="border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 group">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                {r.analysis?.report_type || 'Unknown Report'}
                              </h4>
                              <Badge variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-600">
                                {r.reportMeta?.documentType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(r.createdAt).toLocaleDateString()}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span>{r.reportMeta?.fileName}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <Badge variant="outline" className={
                              r.analysis?.findings?.some(f => f.status.toLowerCase() !== 'normal')
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }>
                              {r.analysis?.findings?.some(f => f.status.toLowerCase() !== 'normal') ? 'Attention Needed' : 'Normal'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-indigo-600"
                              onClick={() => setShowDetailsId(showDetailsId === r._id ? null : r._id)}
                            >
                              {showDetailsId === r._id ? 'Close' : 'View'}
                              {showDetailsId === r._id ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                            </Button>
                          </div>
                        </div>

                        {/* Expandable Mini View */}
                        <AnimatePresence>
                          {showDetailsId === r._id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-slate-100 grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="font-semibold text-slate-900 mb-1">Summary</p>
                                  <p className="text-slate-600 leading-snug">{r.analysis?.summary}</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 mb-1">Top Findings</p>
                                  <ul className="space-y-1">
                                    {r.analysis?.findings?.slice(0, 3).map((f, i) => (
                                      <li key={i} className="flex justify-between text-slate-600 border-b border-slate-50 pb-1 last:border-0">
                                        <span>{f.parameter}</span>
                                        <span className="font-medium text-slate-900">{f.value}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT COLUMN (Sticky Sidebar) --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6 space-y-6">

              {/* Feature Card */}
              <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 border-0 shadow-lg text-white">
                <CardContent className="p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">AI Health Insights</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                      Our HIPAA-compliant engine extracts data from scanned documents, normalizing ranges and spotting trends automatically.
                    </p>
                    <div className="flex gap-2 text-xs font-medium text-white/80">
                      <span className="bg-white/10 px-2 py-1 rounded">Secure</span>
                      <span className="bg-white/10 px-2 py-1 rounded">Private</span>
                      <span className="bg-white/10 px-2 py-1 rounded">Fast</span>
                    </div>
                  </div>
                  {/* Decorative Circle */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-800">Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "Ensure the photo is well-lit and not blurry.",
                    "Capture the full page including headers.",
                    "PDFs are preferred for multi-page reports.",
                    "Verify the patient name matches your profile."
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="mt-0.5 min-w-[16px]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm text-slate-600 leading-snug">{tip}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ReportUpload = () => (
  <ErrorBoundary>
    <ReportUploadComponent />
  </ErrorBoundary>
);

export default ReportUpload;