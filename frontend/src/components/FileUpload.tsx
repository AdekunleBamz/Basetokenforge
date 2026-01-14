"use client";

import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  onChange: (file: File | null) => void;
  onError?: (message: string) => void;
  error?: string;
  hint?: string;
  className?: string;
}

export function FileUpload({
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  onChange,
  onError,
  error,
  hint,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) {
      setPreview(null);
      setSelectedFile(null);
      setLocalError(null);
      onChange(null);
      return;
    }

    if (file.size > maxSize) {
      const message = `File is too large. Max ${Math.round(maxSize / 1024 / 1024)}MB.`;
      setLocalError(message);
      setPreview(null);
      setSelectedFile(null);
      onError?.(message);
      onChange(null);
      return;
    }

    setLocalError(null);
    setSelectedFile(file);
    onChange(file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0] || null);
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer transition-all',
          'border-2 border-dashed',
          isDragging
            ? 'border-forge-orange bg-forge-orange/10'
            : 'border-white/20 hover:border-white/40 bg-white/5',
          (error || localError) && 'border-red-500',
          className
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <Image
              src={preview}
              alt="Preview"
              width={320}
              height={160}
              className="max-h-32 w-auto rounded-lg"
              unoptimized
            />
            {selectedFile && (
              <div className="text-center">
                <p className="text-sm text-white/70 truncate max-w-[240px]">{selectedFile.name}</p>
                <p className="text-xs text-white/40">{Math.round(selectedFile.size / 1024)}KB</p>
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (inputRef.current) inputRef.current.value = '';
                handleFile(null);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                'bg-white/10 hover:bg-white/15 text-white/80'
              )}
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 text-white/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-white/60">Drop file here or click to upload</p>
            <p className="text-xs text-white/30 mt-1">Max {Math.round(maxSize / 1024 / 1024)}MB</p>
          </>
        )}
      </div>
      {(error || localError) && <p className="text-sm text-red-400">{error || localError}</p>}
      {hint && !error && <p className="text-sm text-white/40">{hint}</p>}
    </div>
  );
}
