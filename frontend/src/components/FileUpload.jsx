import axios from 'axios';
import { useEffect, useState } from 'react';
import { AiFillFileImage, AiFillFilePdf } from 'react-icons/ai';
import { FaFileAlt, FaFilePowerpoint, FaFileWord } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const FileUpload = () => {
  const { groupId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [displayedFiles, setDisplayedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [groupId]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/files/${groupId}/view`);
      const sortedFiles = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setFileList(sortedFiles);
      setDisplayedFiles(sortedFiles);
    } catch (err) {
      setError('Error fetching file list');
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage('');
    setError('');
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', fileTitle);

    try {
      await axios.post(`${BACKEND_URL}/api/v1/files/${groupId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMessage('File uploaded successfully!');
      setError('');
      setSelectedFile(null);
      setFileTitle('');
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading file');
      console.error(err);
    }
  };

  const handleFileDelete = async () => {
    if (!fileToDelete) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/files/${fileToDelete}`);
      setShowModal(false);
      fetchFiles();
    } catch (err) {
      setError('Error deleting file');
      console.error(err);
    } finally {
      setFileToDelete(null);
    }
  };

  const openModal = (fileId) => {
    setFileToDelete(fileId);
    setShowModal(true);
  };

  const getFileTypeIcon = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <AiFillFilePdf className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <AiFillFileImage className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === '') {
      setDisplayedFiles(fileList);
    } else {
      const filtered = fileList.filter((file) =>
        file.title.toLowerCase().includes(query.toLowerCase())
      );
      setDisplayedFiles(filtered);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim() === '') {
      setDisplayedFiles(fileList);
    } else {
      const exactMatch = fileList.filter(
        (file) => file.title.toLowerCase() === searchQuery.toLowerCase()
      );
      setDisplayedFiles(exactMatch);
    }
  };

  return (
    <div className="mx-auto text-white bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 shadow-lg w-full rounded-tl-lg rounded-tr-lg">
      <div className="bg-soft-500 p-4">
        <h2 className="text-2xl font-bold text-soft-100 mb-6">Group Media</h2>
      </div>

      <div className="bg-zinc-900 rounded-lg shadow-lg mx-12 mt-8 p-4">
        <h4 className="text-2xl font-semibold mb-4">Shared Files</h4>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            placeholder="Search any file ..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full text-sm text-gray-800 border rounded-md px-4 py-2"
          />
          <button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-700"
          >
            Search
          </button>
        </div>

        <div className="file-list h-64 overflow-y-auto border border-none rounded-lg bg-transparent p-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-900">
          {displayedFiles.length === 0 ? (
            <p className="text-gray-400">No matching media files found.</p>
          ) : (
            <ul className="list-none pl-5">
              {displayedFiles.map((file) => (
                <li key={file._id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span>{getFileTypeIcon(file.path)}</span>
                      <span className="text-blue-600 text-xl cursor-pointer font-semibold">
                        {file.title}
                      </span>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => window.open(file.path, '_blank')}
                        className="py-2 px-4 text-red-600 font-semibold rounded-md hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openModal(file._id)}
                        className="py-2 px-4 text-red-600 font-semibold rounded-md hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-transparent p-6 rounded-lg mt-6 mx-12">
        <h4 className="text-2xl font-semibold text-soft-100 mb-4">Upload Any File</h4>
        <form onSubmit={handleFileUpload} className="mb-4">
          <input
            type="text"
            placeholder="Enter file title"
            value={fileTitle}
            onChange={(e) => setFileTitle(e.target.value)}
            className="block mb-4 text-sm text-gray-800 border rounded-md px-4 py-2"
            required
          />
          <div className="flex items-center space-x-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:border file:cursor-pointer"
              required
            />
            <button
              type="submit"
              className="py-2 px-3 bg-purple-500 text-white font-semibold rounded-md shadow hover:bg-purple-700"
            >
              Upload
            </button>
          </div>
        </form>
        {uploadMessage && <p className="text-green-400 font-semibold text-sm mt-2">{uploadMessage}</p>}
        {error && <p className="text-red-500 font-semibold text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;

