import React from 'react';
import { X, Check, X as XIcon } from 'lucide-react';

export default function DocumentViewer({ document, onClose, onStatusChange }) {
  const getFileType = (base64String) => {
    if (base64String.includes('data:image')) return 'image';
    if (base64String.includes('data:application/pdf')) return 'pdf';
    return 'other';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{document.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 flex flex-col h-[70vh]">
          {getFileType(document.fileData) === 'image' ? (
            <img src={document.fileData} alt={document.name} className="max-h-full object-contain mx-auto" />
          ) : getFileType(document.fileData) === 'pdf' ? (
            <iframe src={document.fileData} className="w-full h-full" title={document.name} />
          ) : (
            <div className="text-center text-gray-500">Preview not available</div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Uploaded on {new Date(document.date).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(document.id, 'rejected')}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
            >
              <XIcon className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={() => onStatusChange(document.id, 'verified')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
