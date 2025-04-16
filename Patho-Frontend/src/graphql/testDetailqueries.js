import { gql } from "@apollo/client";

export const GET_REPORTS_BY_PATIENT_ID = gql`
  query GetReportsByPatientId($patientId: ID!) {
    getReportsByPatientId(patientId: $patientId) {
      id
      testName
      fields {
        fieldName
        results
        units
        referenceRange
      }
    }
  }
`;
