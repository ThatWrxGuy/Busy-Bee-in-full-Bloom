/**
 * Busy Bee Upload - Design System Implementation
 */

import { useState, useRef } from 'react';
import { FiUpload, FiFile, FiImage, FiVideo, FiMusic, FiX } from 'react-icons/fi';
import { PageContainer, Card, CardHeader, CardTitle, CardContent, Button } from '../components';

const MOCK_FILES = [
  { id: 1, name: 'profile-photo.jpg', size: '2.4 MB', type: 'image', uploaded: true },
  { id: 2, name: 'resume-2024.pdf', size: '156 KB', type: 'document', uploaded: true },
];

const ICONS = {
  image: FiImage,
  document: FiFile,
  video: FiVideo,
  audio: FiMusic,
};

function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState(MOCK_FILES);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload
  };

  const removeFile = (id) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <PageContainer title="Upload" subtitle="Upload files and media">
      {/* Upload Area */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <FiUpload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drag and drop your files here
            </h3>
            <p className="text-foreground-muted mb-4">or click to browse from your computer</p>
            <input type="file" multiple className="hidden" id="file-upload" />
            <Button as="label" htmlFor="file-upload" className="cursor-pointer">
              Browse Files
            </Button>
            <p className="text-xs text-foreground-muted mt-4">
              Supports: Images, Documents, Videos, Audio (max 50MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <Card>
        <CardHeader title="Uploaded Files" />
        <CardContent className="p-0">
          {files.length > 0 ? (
            <div className="divide-y divide-border">
              {files.map((file) => {
                const Icon = ICONS[file.type] || FiFile;
                return (
                  <div key={file.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary rounded">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-foreground-muted">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                      <FiX className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-foreground-muted">No files uploaded yet</div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default Upload;
