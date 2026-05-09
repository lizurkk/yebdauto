
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageUpload: (base64: string) => void;
  label?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  currentImage, 
  onImageUpload, 
  label = "Image", 
  className = "" 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Veuillez choisir une image valide.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageUpload(base64String);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-black text-[#00ADB5] uppercase tracking-widest pl-2">
        {label}
      </label>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-[30px] transition-all cursor-pointer overflow-hidden
          h-48 flex flex-col items-center justify-center gap-3
          ${isDragging 
            ? 'border-[#00ADB5] bg-[#00ADB5]/5' 
            : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#09090b] hover:border-[#00ADB5]/50'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          className="hidden" 
          accept="image/*" 
        />
        
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <div className="bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Upload size={14} /> Changer l'image
               </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setPreview(undefined); onImageUpload(''); }}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-[#00ADB5]/10 text-[#00ADB5] flex items-center justify-center">
               <ImageIcon size={24} />
            </div>
            <div className="text-center">
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Déposer une image ici</div>
               <div className="text-[9px] text-zinc-500 font-bold mt-1">ou cliquez pour parcourir</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
