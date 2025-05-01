import React from "react";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null; // Do not render if the modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-soft-500 rounded-lg p-5 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-white ">This action cannot be undone. <br/>Do you want to continue ?</h2>
        
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-purple-500 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg mr-2"
            onClick={onConfirm}
          >
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
