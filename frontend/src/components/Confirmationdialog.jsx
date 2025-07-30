import React from "react";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="z-10 w-4/5 p-6 mx-auto bg-white rounded-lg md:w-1/3">
        <h2 className="mb-4 text-xl font-semibold">Confirm Submission</h2>
        <p className="mb-6">Are you sure you want to submit your answers?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 duration-300 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#063173] hover:bg-[#184286] duration-300 text-white rounded-lg"
            onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
