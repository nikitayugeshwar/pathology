import React from "react";
export default function ColorCard({ icon, text, number, color }) {
  return (
    <>
      {/* color card  */}
      <div
        className={`w-full rounded-md flex flex-col items-center justify-center text-center gap-3 ${color} p-3 border border-gray-300  shadow-lg py-4`}
      >
        <img src={icon} />

        <h1 className="text-md font-semibold text-black">{text}</h1>
        <h1 className="text-xl font-bold text-black">{number}</h1>
      </div>
    </>
  );
}
