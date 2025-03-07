import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Eye } from 'lucide-react';
import UploadDocumentModal from '../components/UploadDocumentModal.jsx';
import DocumentViewer from '../components/assistant/DocumentViewer';

function Documents() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentsList, setDocumentsList] = useState(() => {
    return JSON.parse(localStorage.getItem("documentsList")) || [];
  });

  const [downloading, setDownloading] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Function to convert file to Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadDocument = async (newDocument) => {
    const base64File = await convertFileToBase64(newDocument.file);

    const document = {
      id: Date.now().toString(),
      name: newDocument.name,
      type: newDocument.file.type,
      date: new Date().toISOString(),
      status: "pending_review", // Default status
      fileData: base64File, // Store file as Base64 string
    };

    const updatedDocuments = [...documentsList, document];
    setDocumentsList(updatedDocuments);
    localStorage.setItem("documentsList", JSON.stringify(updatedDocuments));
  };

  useEffect(() => {
    localStorage.setItem("documentsList", JSON.stringify(documentsList));
  }, [documentsList]);

  const handleDownload = async (doc) => {
    try {
      setDownloading(doc.id);
      const link = document.createElement("a");
      link.href = doc.fileData;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const handleDeleteDocument = (id) => {
    const updatedDocuments = documentsList.filter(doc => doc.id !== id);
    setDocumentsList(updatedDocuments);
    localStorage.setItem("documentsList", JSON.stringify(updatedDocuments));
  };

  const handleStatusChange = (docId, newStatus) => {
    const updatedDocuments = documentsList.map(doc => 
      doc.id === docId ? { ...doc, status: newStatus } : doc
    );
    setDocumentsList(updatedDocuments);
    setSelectedDocument(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "needs_action":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "pending_review":
        return "Pending Review";
      case "needs_action":
        return "Needs Action";
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tax Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your tax-related documents
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
        >
          Upload Document
        </button>
      </div>

      <div className="overflow-hidden bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documentsList.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {doc.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{doc.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {new Date(doc.date).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      doc.status
                    )}`}
                  >
                    {getStatusText(doc.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                  <button 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    className={`text-primary hover:text-primary/80 ${
                      downloading === doc.id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleDownload(doc)}
                    disabled={downloading === doc.id}
                  >
                    <Download className={`w-5 h-5 ${downloading === doc.id ? "animate-bounce" : ""}`} />
                  </button>

                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <UploadDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUploadDocument}
      />
    </div>
  );
}

export default Documents;
