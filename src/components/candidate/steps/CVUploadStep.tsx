
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Eye, ZoomIn, ZoomOut, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FilePreview from '../FilePreview';

interface CVUploadStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const CVUploadStep: React.FC<CVUploadStepProps> = ({ data, onComplete, persona }) => {
  const [file, setFile] = useState<File | null>(data.file || null);
  const [previewContent, setPreviewContent] = useState(data.previewContent || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const acceptedTypes = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'text/plain': 'TXT'
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (selectedFile: File) => {
    if (!Object.keys(acceptedTypes).includes(selectedFile.type)) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: "يرجى رفع ملف PDF، DOC، DOCX، أو TXT",
        variant: "destructive"
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "حجم الملف كبير جداً",
        description: "يرجى رفع ملف أصغر من 10 ميجابايت",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Parse file content
      const content = await parseFile(selectedFile);
      setPreviewContent(content);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        toast({
          title: "تم رفع السيرة الذاتية!",
          description: "تم تحليل المحتوى بنجاح",
          duration: 3000
        });
      }, 500);

    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      toast({
        title: "خطأ في رفع الملف",
        description: "حدث خطأ أثناء معالجة الملف، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const parseFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          
          if (file.type === 'text/plain') {
            resolve(result as string);
          } else if (file.type === 'application/pdf') {
            // For PDF parsing, we'll simulate the extraction
            // In real implementation, you'd use pdf-parse or similar
            resolve(`
محتوى السيرة الذاتية:

الاسم: أحمد محمد العلي
الهاتف: +966501234567
البريد الإلكتروني: ahmed@example.com

الخبرات:
- مطور ويب في شركة التقنية المتقدمة (2020-2023)
- مطور تطبيقات في شركة الحلول الذكية (2018-2020)

المهارات:
- React.js, Node.js
- JavaScript, TypeScript
- MongoDB, PostgreSQL

التعليم:
- بكالوريوس علوم الحاسب - جامعة الملك سعود (2018)
            `.trim());
          } else {
            // For DOC/DOCX, simulate extraction
            resolve(`
السيرة الذاتية

المعلومات الشخصية:
الاسم: فاطمة سالم الأحمد
التخصص: مصممة UI/UX
الهاتف: +966502345678

الخبرة المهنية:
- مصممة أولى في وكالة الإبداع الرقمي (2021-2023)
- مصممة جرافيك في استوديو التصميم الحديث (2019-2021)

المهارات التقنية:
- Adobe Creative Suite
- Figma, Sketch
- HTML/CSS, React

الشهادات:
- دبلوم التصميم الجرافيكي - معهد التصميم العالي
- شهادة UX Design - Google
            `.trim());
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('خطأ في قراءة الملف'));
      reader.readAsText(file);
    });
  };

  const handleContinue = () => {
    if (!file) {
      toast({
        title: "لم يتم رفع سيرة ذاتية",
        description: "يرجى رفع السيرة الذاتية أولاً",
        variant: "destructive"
      });
      return;
    }

    onComplete({
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      previewContent,
      uploadedAt: new Date().toISOString()
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Upload className="w-16 h-16 text-blue-500" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          ارفع سيرتك الذاتية
        </h3>
        <p className="text-gray-600">
          ادعم الملفات: PDF، DOC، DOCX، TXT (حتى 10 ميجابايت)
        </p>
      </div>

      {!file ? (
        <motion.div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
        >
          <input
            type="file"
            id="cv-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInput}
          />
          
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            اسحب الملف هنا أو انقر للاختيار
          </h4>
          <p className="text-gray-500 mb-6">
            ادعم ملفات PDF، DOC، DOCX، TXT
          </p>
          
          <Button 
            size="lg"
            onClick={() => document.getElementById('cv-upload')?.click()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            اختيار ملف السيرة الذاتية
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Upload Progress */}
          <AnimatePresence>
            {uploading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 p-4 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  <span className="font-medium">جاري رفع ومعالجة الملف...</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* File Info */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h4 className="font-semibold text-green-800">{file.name}</h4>
                  <p className="text-green-600 text-sm">
                    {formatFileSize(file.size)} • {acceptedTypes[file.type as keyof typeof acceptedTypes]}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  تغيير الملف
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Preview */}
          {previewContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-2xl overflow-hidden"
            >
              <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">معاينة المحتوى</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">{zoomLevel}%</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div 
                className="p-6 max-h-96 overflow-y-auto bg-white text-right"
                style={{ fontSize: `${zoomLevel}%` }}
              >
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {previewContent}
                </pre>
              </div>
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.div 
            className="flex justify-center pt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleContinue}
              size="lg"
              className="px-12 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg font-semibold"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2" />
                  جاري المعالجة...
                </>
              ) : (
                'متابعة للتحليل ←'
              )}
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CVUploadStep;
