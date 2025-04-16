export default function EventCard({ subjectName, time, discription }) {
  return (
    <>
      {/* event card  */}
      <div className="h-[100px] w-full bg-green-100 rounded-lg flex flex-col gap-2 p-4 border-2 border-green-500">
        <h1 className="text-black text-sm font-medium">{subjectName}</h1>
        <p className="text-xs text-gray-800"> {time} </p>
        <p className="text-xs text-gray-800"> {discription} </p>
      </div>
    </>
  );
}
