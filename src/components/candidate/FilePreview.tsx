import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, Download, X, FileText, File } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  textExtract?: string;
  onClose: () => void;
  onZoomChange?: (zoom: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, textExtract, onClose, onZoomChange }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFilePreview();
  }, [file]);

  useEffect(() => {
    if (onZoomChange) {
      onZoomChange(zoom);
    }
  }, [zoom, onZoomChange]);

  const loadFilePreview = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      if (file.type.includes('pdf')) {
        // For PDF files, we'll show the text extract or a placeholder
        if (textExtract) {
          setPreviewContent(textExtract);
        } else {
          setPreviewContent('جارٍ معالجة ملف PDF...');
        }
      } else if (file.type.includes('word') || file.type.includes('document')) {
        // For Word documents, show text extract
        if (textExtract) {
          setPreviewContent(textExtract);
        } else {
          setPreviewContent('جارٍ معالجة مستند Word...');
        }
      } else if (file.type === 'text/plain') {
        // For text files, read directly
        const text = await file.text();
        setPreviewContent(text);
      } else if (file.type.startsWith('image/')) {
        // For images, create object URL
        const imageUrl = URL.createObjectURL(file);
        setPreviewContent(imageUrl);
      } else {
        setPreviewContent('نوع الملف غير مدعوم للمعاينة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المعاينة');
      console.error('Preview error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>جارٍ تحميل المعاينة...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (file.type.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center h-full">
          <motion.img
            src={previewContent}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: zoom }}
            transition={{ duration: 0.3 }}
          />
        </div>
      );
    }

    return (
      <div 
        className="h-full p-6 overflow-auto text-right"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top right'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="whitespace-pre-wrap font-mono text-sm leading-relaxed"
        >
          {previewContent}
        </motion.div>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلو بايت', 'ميجا بايت', 'جيجا بايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-semibold text-lg">{file.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)} • {file.type}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-sm font-mono min-w-16 text-center">
                {Math.round(zoom * 100)}%
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              {file.type.startsWith('image/') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div 
            ref={previewRef}
            className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900"
          >
            {renderPreviewContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreview;