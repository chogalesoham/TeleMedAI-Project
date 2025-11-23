import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  X, 
  CheckCircle2,
  Loader2,
  Eye,
  Download,
  Trash2,
  Scan
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  category: string;
  date: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
}

export const ReportUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('lab-report');
  const [notes, setNotes] = useState('');

  const categories = [
    { value: 'lab-report', label: 'Lab Report', icon: FileText },
    { value: 'prescription', label: 'Prescription', icon: FileText },
    { value: 'imaging', label: 'X-Ray/Scan', icon: Image },
    { value: 'consultation', label: 'Consultation Report', icon: File },
    { value: 'other', label: 'Other', icon: File },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      category: selectedCategory,
      date: new Date().toLocaleDateString(),
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles(prev =>
        prev.map(f =>
          f.id === fileId ? { ...f, progress } : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFiles(prev =>
            prev.map(f =>
              f.id === fileId ? { ...f, status: 'processing' } : f
            )
          );
          
          // Simulate processing with OCR
          setTimeout(() => {
            setFiles(prev =>
              prev.map(f =>
                f.id === fileId ? { ...f, status: 'completed' } : f
              )
            );
          }, 2000);
        }, 500);
      }
    }, 200);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      case 'processing':
        return <Scan className="w-4 h-4 animate-pulse text-orange-600" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'error':
        return <X className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing with AI OCR...';
      case 'completed': return 'Completed';
      case 'error': return 'Error';
    }
  };

  return (
    <div className="mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">Upload Medical Reports</h1>
        <p className="text-sm sm:text-base text-gray-600">Upload and manage your medical documents with AI-powered OCR</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Upload Zone */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Category Selection */}
                <div>
                  <Label htmlFor="category" className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block">
                    Select Document Type
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category" className="text-xs sm:text-sm">
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="text-xs sm:text-sm">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <cat.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Drag & Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-lg p-6 sm:p-8 md:p-12 text-center transition-colors
                    ${isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1">
                        <span className="hidden sm:inline">Drop files here or click to upload</span>
                        <span className="sm:hidden">Tap to upload files</span>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Supports: PDF, Images (JPG, PNG), Word Documents
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum file size: 10MB
                      </p>
                    </div>
                    <label htmlFor="file-upload">
                      <Button asChild className="text-xs sm:text-sm">
                        <span className="cursor-pointer">
                          <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                          Choose Files
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="notes" className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                    Add Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any relevant notes about these documents..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[70px] sm:min-h-[80px] text-xs sm:text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <Card>
              <CardContent className="p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  Uploaded Files ({files.length})
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <AnimatePresence>
                    {files.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          {/* File Icon */}
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {file.type.includes('image') ? (
                              <Image className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-primary" />
                            ) : (
                              <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-primary" />
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{file.name}</p>
                                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {file.category}
                                  </Badge>
                                  <span className="text-xs text-gray-600">{file.size}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                                {file.status === 'completed' && (
                                  <>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8">
                                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8">
                                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </Button>
                                  </>
                                )}
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-7 w-7 sm:h-8 sm:w-8 text-red-600 hover:text-red-700"
                                  onClick={() => removeFile(file.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                              {getStatusIcon(file.status)}
                              <span className="text-xs sm:text-sm text-gray-600">{getStatusText(file.status)}</span>
                            </div>

                            {/* Progress Bar */}
                            {file.status === 'uploading' && file.progress !== undefined && (
                              <div className="mt-1.5 sm:mt-2">
                                <div className="h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${file.progress}%` }}
                                    className="h-full bg-primary"
                                  />
                                </div>
                              </div>
                            )}

                            {/* OCR Results Preview */}
                            {file.status === 'completed' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 sm:mt-3 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200"
                              >
                                <div className="flex items-start gap-1.5 sm:gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <div className="text-xs sm:text-sm">
                                    <p className="font-medium text-green-900">AI Processing Complete</p>
                                    <p className="text-green-700 text-xs mt-0.5 sm:mt-1">
                                      Document has been analyzed and data extracted successfully
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Upload Statistics</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Total Uploads</span>
                  <span className="text-sm sm:text-base font-semibold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">This Month</span>
                  <span className="text-sm sm:text-base font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Storage Used</span>
                  <span className="text-sm sm:text-base font-semibold">2.4 GB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI OCR Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <Scan className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-1.5 sm:mb-2">AI-Powered OCR</h3>
                  <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                    Our AI automatically extracts text and medical data from your documents, 
                    making them searchable and organized.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Upload Tips</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Ensure documents are clear and readable</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Select correct category for better organization</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Add notes to provide context</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>PDF format works best for reports</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportUpload;
