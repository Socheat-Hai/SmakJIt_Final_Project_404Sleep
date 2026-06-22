import { useState } from 'react';
import { useToast } from './Toast';
import api from '../services/api';

const ImageUpload = ({ currentImage, onUpload, endpoint, label }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const { showToast } = useToast();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.append(endpoint === 'org-logo' ? 'logo' : endpoint === 'profile-photo' ? 'photo' : 'image', file);

    setUploading(true);
    try {
      const res = await api.post(`/upload/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload(res.data.photoUrl || res.data.logoUrl || res.data.imageUrl);
      showToast('Image uploaded successfully');
    } catch {
      showToast('Failed to upload image', 'error');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border-2 border-gray-200">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl text-gray-300">+</span>
        )}
      </div>
      <div>
        <label className="cursor-pointer btn btn-sm btn-outline">
          {uploading ? 'Uploading...' : label || 'Choose Image'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
        <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
      </div>
    </div>
  );
};

export default ImageUpload;
