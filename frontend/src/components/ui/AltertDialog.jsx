import React from "react";

export const AlertDialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        {children}
      </div>
    </div>
  );
};

export const AlertDialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const AlertDialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

export const AlertDialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600">{children}</p>
);

export const AlertDialogFooter = ({ children }) => (
  <div className="mt-6 flex justify-end space-x-2">{children}</div>
);

export const AlertDialogCancel = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
  >
    {children}
  </button>
);

export const AlertDialogAction = ({ onClick, children, variant = "primary" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-white ${
      variant === "primary"
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-gray-600 hover:bg-gray-700"
    }`}
  >
    {children}
  </button>
);
