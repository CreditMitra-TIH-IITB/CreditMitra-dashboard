import React, { useRef, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

interface UploadDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  file,
  onFileSelect,
  onProcess,
  isProcessing,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.toLowerCase().endsWith('.pdf')) {
        onFileSelect(droppedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full relative group">
      {/* Decorative gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm pointer-events-none" />

      <div className="relative bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 md:p-12 text-center transition-all duration-300">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-white mb-3">
          Analyze a statement
        </h2>
        <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl mx-auto">
          Upload a PDF bank statement. Tables are seamlessly parsed, narrations normalized to a
          single line, and payees identified per transaction.
        </p>

        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border border-dashed rounded-lg p-10 mb-6 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3',
            isDragOver
              ? 'border-amber-500/50 bg-amber-500/5'
              : 'border-white/10 hover:border-amber-500/30 hover:bg-white/5',
          )}
        >
          <div className="p-4 bg-slate-800/50 rounded-full text-amber-500 mb-2">
            <UploadCloud size={32} />
          </div>
          <div className="text-sm text-slate-400">
            Drag and drop your PDF here <br />
            <strong className="text-white font-medium mt-1 inline-block">or click to browse</strong>
          </div>
        </div>

        <input
          type="file"
          accept=".pdf"
          className="hidden"
          ref={inputRef}
          onChange={handleChange}
        />

        {file && (
          <div className="flex items-center justify-center gap-2 text-sm text-amber-400 font-mono mb-8 bg-amber-500/10 py-2 px-4 rounded-full w-fit mx-auto border border-amber-500/20">
            <FileText size={16} />
            {file.name}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-6 py-2.5 text-sm font-medium text-slate-300 border border-white/10 rounded-lg hover:text-white hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300 w-full sm:w-auto"
          >
            Select file
          </button>

          <button
            type="button"
            disabled={!file || isProcessing}
            onClick={onProcess}
            className="px-6 py-2.5 text-sm font-medium text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 w-full sm:w-auto shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
          >
            {isProcessing ? 'Processing...' : 'Run extraction'}
          </button>
        </div>
      </div>
    </div>
  );
};
