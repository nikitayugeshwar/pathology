const studentData = [
  {
    srNo: "01",
    patientNo: "0123",
    name: "Karan Kumar",
    testName: "Kidney Function Test",
    contactNo: "999999999",
    gender: "Male",
    age: "30",
    sampleCollector: "Blood",
    action: { edit: "Edit", delete: "Delete" },
    color: "bg-gray-100",
  },
  {
    srNo: "01",
    patientNo: "0123",
    name: "Karan Kumar",
    testName: "Kidney Function Test",
    contactNo: "999999999",
    gender: "Male",
    age: "30",
    sampleCollector: "Blood",
    action: { edit: "Edit", delete: "Delete" },
    color: "bg-gray-100",
  },
  {
    srNo: "01",
    patientNo: "0123",
    name: "Karan Kumar",
    testName: "Kidney Function Test",
    contactNo: "999999999",
    gender: "Male",
    age: "30",
    sampleCollector: "Blood",
    action: { edit: "Edit", delete: "Delete" },
    color: "bg-gray-100",
  },
  {
    srNo: "01",
    patientNo: "0123",
    name: "Karan Kumar",
    testName: "Kidney Function Test",
    contactNo: "999999999",
    gender: "Male",
    age: "30",
    sampleCollector: "Blood",
    action: { edit: "Edit", delete: "Delete" },
    color: "bg-gray-100",
  },
  {
    srNo: "01",
    patientNo: "0123",
    name: "Karan Kumar",
    testName: "Kidney Function Test",
    contactNo: "999999999",
    gender: "Male",
    age: "30",
    sampleCollector: "Blood",
    action: { edit: "Edit", delete: "Delete" },
    color: "bg-gray-100",
  },
  {
    srNo: "01",
    patientNo: "0123",
    name: "Karan Kumar",
    testName: "Kidney Function Test",
    contactNo: "999999999",
    gender: "Male",
    age: "30",
    sampleCollector: "Blood",
    action: { edit: "Edit", delete: "Delete" },
    color: "bg-gray-100",
  },
];

export default function StudentTable() {
  return (
    <>
      {/* student table  */}
      <div className=" w-full">
        <table className="w-full bg-white    rounded-lg overflow-hidden">
          <thead className=" bg-blue-200  h-14 py-10">
            <tr className="  text-gray-700   text-sm font-normal leading-normal  ">
              <th className="py-4 px-6 text-left">Sr. No</th>
              <th className="py-4 px-6 text-left">Patient No</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Test Name</th>
              <th className="py-4 px-6 text-left">Contact No</th>
              <th className="py-4 px-6 text-left">Gender</th>
              <th className="py-4 px-6 text-left">Age</th>
              <th className="py-4 px-6 text-left">Sample Collector</th>
              <th className="py-4 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {studentData.map((item, index) => (
              <tr
                key={index}
                className={` text-gray-700   text-sm font-normal leading-normal ${
                  index % 2 === 0
                    ? "bg-gray-100"
                    : "bg-white border-b border-t border-gray-300"
                }`}
              >
                <td className="py-4 px-6 text-left">{item.srNo}</td>
                <td className="py-4 px-6 text-left ">{item.patientNo}</td>
                <td className="py-4 px-6 text-left text-blue-600 underline">
                  {item.name}
                </td>
                <td className="py-4 px-6 text-left">{item.testName}</td>
                <td className="py-4 px-6 text-left">{item.contactNo}</td>
                <td className="py-4 px-6 text-left">{item.gender}</td>
                <td className="py-4 px-6 text-left">{item.age}</td>
                <td className="py-4 px-6 text-left">{item.sampleCollector}</td>
                <td className={`py-4 px-6 text-left flex gap-2  `}>
                  <button
                    // onClick={item.action === "Due Amount" ? openNotice : openSlip}
                    className="text-blue-600"
                  >
                    {item.action.edit}
                  </button>{" "}
                  <h1>|</h1>
                  <button
                    // onClick={item.action === "Due Amount" ? openNotice : openSlip}
                    className="text-red-600"
                  >
                    {item.action.delete}
                  </button>{" "}
                </td>
                {/* <td className="py-4 px-6 text-left">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">
                    {item.fatherName}
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
