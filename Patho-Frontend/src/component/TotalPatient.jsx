import React from "react";
import { useSelector } from "react-redux";
import ColorCard from "./ColorCard";
import patient from "./patient.png";

const TotalPatient = () => {
  const { patients = [] } = useSelector((state) => state.patient || {});

  const totalPatients = patients?.length || 0;
  return (
    <>
      {" "}
      <ColorCard
        icon={patient}
        text={"Total Patients"}
        number={totalPatients}
        color={"bg-white"}
      />
    </>
  );
};

export default TotalPatient;
