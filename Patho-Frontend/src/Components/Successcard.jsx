"use client";
import React, { useEffect, useRef } from "react";

export default function Successcard({ onClose, para }) {
  const successRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (successRef.current && !successRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div
          ref={successRef}
          className="w-[320px] h-[180px] flex flex-col items-center justify-center gap-3 p-3 bg-white rounded-lg
        "
        >
          {" "}
          <h1 className="text-xl font-bold">Successful</h1>
          <h1 className="text-sm font-normal">{para}</h1>
          <button
            className="mt-4 bg-blue-900 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
