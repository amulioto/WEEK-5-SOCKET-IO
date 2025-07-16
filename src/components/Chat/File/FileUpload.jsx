import { useState } from 'react';
import { useSocket } from '../../../context/SocketContext';

const FileUpload = ({ room }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { socket } = useSocket();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const { url, type, originalName } = await res.json();
      socket.emit('send file', { 
        room, 
        fileUrl: url, 
        fileType: type,
        originalName 
      });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="file-upload">
      <label>
        {isUploading ? 'Uploading...' : 'Attach File'}
        <input 
          type="file" 
          onChange={handleUpload}
          disabled={isUploading}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.docx,.txt"
        />
      </label>
    </div>
  );
};

export default FileUpload;