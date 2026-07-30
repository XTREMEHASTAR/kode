import React, { useRef, useState } from 'react';

interface ScriptUploadZoneProps {
  onTextUploaded: (text: string, title?: string) => void;
  onError: (msg: string) => void;
}

export const ScriptUploadZone: React.FC<ScriptUploadZoneProps> = ({
  onTextUploaded,
  onError
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.name.endsWith('.txt')) {
      onError('Only .txt files are supported.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      onError('File size exceeds the 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        // Strip out extension for title
        const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
        onTextUploaded(text, cleanTitle);
      } else {
        onError('Could not read file contents.');
      }
    };
    reader.onerror = () => {
      onError('Error reading file.');
    };
    reader.readAsText(file);
  };

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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div>
      <label className="ft-label">Or upload a file</label>
      <div 
        className={`ft-upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".txt"
          onChange={handleFileChange}
        />
        <svg className="ft-upload-icon" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="ft-upload-text">
          Drag & drop a <strong>.txt</strong> file here
        </p>
        <p className="ft-upload-subtext">
          or click to browse
        </p>
      </div>
      <p className="ft-upload-subtext" style={{ marginTop: '8px', color: 'var(--ft-text-secondary)' }}>
        Max file size: 2MB
      </p>
    </div>
  );
};
