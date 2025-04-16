const express = require("express");
const router = express.Router();

const tests = [
  {
    id: 1,
    testName: "Complete Blood Count (CBC)",
    subtests: [
      {
        subtestName: "Hemoglobin",
        fields: [
          {
            fieldName: "Hemoglobin (Hb)",
            units: "g/dL",
            referenceRange: "13.0 - 17.0",
            result: "12.5",
            status: "Low",
          },
        ],
      },
      {
        subtestName: "RBC Count",
        fields: [
          {
            fieldName: "Total RBC count",
            units: "mill/cumm",
            referenceRange: "4.5 - 5.5",
            result: "5.2",
          },
        ],
      },
      {
        subtestName: "Blood Indices",
        fields: [
          {
            fieldName: "Packed Cell Volume (PCV)",
            units: "%",
            referenceRange: "40 - 50",
            result: "57.5",
            status: "High",
          },
          {
            fieldName: "Mean Corpuscular Volume (MCV)",
            units: "fL",
            referenceRange: "83 - 101",
            result: "87.75",
          },
          {
            fieldName: "MCH Calculated",
            units: "pg",
            referenceRange: "27 - 32",
            result: "27.2",
          },
          {
            fieldName: "MCHC Calculated",
            units: "g/dL",
            referenceRange: "32.5 - 34.5",
            result: "32.8",
          },
          {
            fieldName: "RDW",
            units: "%",
            referenceRange: "11.6 - 14.0",
            result: "13.6",
          },
        ],
      },
      {
        subtestName: "WBC Count",
        fields: [
          {
            fieldName: "Total WBC count",
            units: "cumm",
            referenceRange: "4000 - 11000",
            result: "9000",
          },
        ],
      },
      {
        subtestName: "Differential WBC Count",
        fields: [
          {
            fieldName: "Neutrophils",
            units: "%",
            referenceRange: "50 - 62",
            result: "60",
          },
          {
            fieldName: "Lymphocytes",
            units: "%",
            referenceRange: "20 - 40",
            result: "31",
          },
          {
            fieldName: "Eosinophils",
            units: "%",
            referenceRange: "0 - 6",
            result: "1",
          },
          {
            fieldName: "Monocytes",
            units: "%",
            referenceRange: "0 - 10",
            result: "7",
          },
          {
            fieldName: "Basophils",
            units: "%",
            referenceRange: "0 - 2",
            result: "1",
          },
        ],
      },
      {
        subtestName: "Platelet Count",
        fields: [
          {
            fieldName: "Platelet Count",
            units: "cumm",
            referenceRange: "150000 - 410000",
            result: "320000",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    testName: "Lipid Profile",
    subtests: [
      {
        subtestName: "Total Cholesterol",
        fields: [
          {
            fieldName: "Total Cholesterol",
            units: "mg/dL",
            referenceRange: "120 - 200",
            result: "250",
            status: "High",
          },
        ],
      },
      {
        subtestName: "HDL Cholesterol",
        fields: [
          {
            fieldName: "HDL Cholesterol",
            units: "mg/dL",
            referenceRange: "40 - 60",
            result: "35",
            status: "Low",
          },
        ],
      },
      {
        subtestName: "LDL Cholesterol",
        fields: [
          {
            fieldName: "LDL Cholesterol",
            units: "mg/dL",
            referenceRange: "0 - 100",
            result: "160",
            status: "High",
          },
        ],
      },
      {
        subtestName: "Triglycerides",
        fields: [
          {
            fieldName: "Triglycerides",
            units: "mg/dL",
            referenceRange: "50 - 150",
            result: "200",
            status: "High",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    testName: "Thyroid Function Test (TFT)",
    subtests: [
      {
        subtestName: "TSH",
        fields: [
          {
            fieldName: "Thyroid Stimulating Hormone (TSH)",
            units: "µIU/mL",
            referenceRange: "0.4 - 4.0",
            result: "5.5",
            status: "High",
          },
        ],
      },
      {
        subtestName: "Free T3",
        fields: [
          {
            fieldName: "Free T3",
            units: "pg/mL",
            referenceRange: "2.3 - 4.2",
            result: "3.5",
          },
        ],
      },
      {
        subtestName: "Free T4",
        fields: [
          {
            fieldName: "Free T4",
            units: "ng/dL",
            referenceRange: "0.9 - 1.7",
            result: "1.0",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    testName: "Renal Function Test",
    subtests: [
      {
        subtestName: "Blood Urea Nitrogen (BUN)",
        fields: [
          {
            fieldName: "Blood Urea Nitrogen (BUN)",
            units: "mg/dL",
            referenceRange: "7 - 20",
            result: "18",
          },
        ],
      },
      {
        subtestName: "Creatinine",
        fields: [
          {
            fieldName: "Creatinine",
            units: "mg/dL",
            referenceRange: "0.6 - 1.2",
            result: "1.1",
          },
        ],
      },
      {
        subtestName: "eGFR",
        fields: [
          {
            fieldName: "eGFR",
            units: "mL/min/1.73m2",
            referenceRange: "90 - 120",
            result: "90",
          },
        ],
      },
      {
        subtestName: "Urine Protein",
        fields: [
          {
            fieldName: "Urine Protein",
            units: "mg/dL",
            referenceRange: "Negative",
            result: "Negative",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    testName: "Liver Function Test",
    subtests: [
      {
        subtestName: "Total Bilirubin",
        fields: [
          {
            fieldName: "Total Bilirubin",
            units: "mg/dL",
            referenceRange: "0.1 - 1.2",
            result: "0.8",
          },
        ],
      },
      {
        subtestName: "AST",
        fields: [
          {
            fieldName: "Aspartate Aminotransferase (AST)",
            units: "U/L",
            referenceRange: "10 - 40",
            result: "25",
          },
        ],
      },
      {
        subtestName: "ALT",
        fields: [
          {
            fieldName: "Alanine Aminotransferase (ALT)",
            units: "U/L",
            referenceRange: "10 - 40",
            result: "30",
          },
        ],
      },
      {
        subtestName: "ALP",
        fields: [
          {
            fieldName: "Alkaline Phosphatase (ALP)",
            units: "U/L",
            referenceRange: "44 - 121",
            result: "90",
          },
        ],
      },
      {
        subtestName: "Albumin",
        fields: [
          {
            fieldName: "Albumin",
            units: "g/dL",
            referenceRange: "3.5 - 5.0",
            result: "4.2",
          },
        ],
      },
      {
        subtestName: "Total Protein",
        fields: [
          {
            fieldName: "Total Protein",
            units: "g/dL",
            referenceRange: "6.0 - 8.3",
            result: "7.2",
          },
        ],
      },
    ],
  },

  {
    id: 6,
    testName: "Glucose Tolerance Test",
    subtests: [
      {
        subtestName: "Fasting Glucose",
        fields: [
          {
            fieldName: "Fasting Glucose",
            units: "mg/dl",
            referenceRange: "70 - 100",
            result: null,
          },
        ],
      },
      {
        subtestName: "1-Hour Postprandial Glucose",
        fields: [
          {
            fieldName: "1-Hour Postprandial Glucose",
            units: "mg/dl",
            referenceRange: "<140",
            result: null,
          },
        ],
      },
      {
        subtestName: "2-Hour Postprandial Glucose",
        fields: [
          {
            fieldName: "2-Hour Postprandial Glucose",
            units: "mg/dl",
            referenceRange: "<140",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 7,
    testName: "Iron Studies",
    subtests: [
      {
        subtestName: "Serum Iron",
        fields: [
          {
            fieldName: "Serum Iron",
            units: "mcg/dl",
            referenceRange: "60 - 170",
            result: null,
          },
        ],
      },
      {
        subtestName: "Total Iron-Binding Capacity (TIBC)",
        fields: [
          {
            fieldName: "Total Iron-Binding Capacity (TIBC)",
            units: "mcg/dl",
            referenceRange: "240 - 450",
            result: null,
          },
        ],
      },
      {
        subtestName: "% Transferrin Saturation",
        fields: [
          {
            fieldName: "% Transferrin Saturation",
            units: "%",
            referenceRange: "20 - 50",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 8,
    testName: "Vitamin D Test",
    subtests: [
      {
        subtestName: "Vitamin D (25-hydroxy)",
        fields: [
          {
            fieldName: "Vitamin D (25-hydroxy)",
            units: "ng/ml",
            referenceRange: "30 - 100",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 9,
    testName: "Vitamin B12 Test",
    subtests: [
      {
        subtestName: "Vitamin B12",
        fields: [
          {
            fieldName: "Vitamin B12",
            units: "pg/ml",
            referenceRange: "200 - 900",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 10,
    testName: "Electrolyte Panel",
    subtests: [
      {
        subtestName: "Sodium",
        fields: [
          {
            fieldName: "Sodium",
            units: "mEq/L",
            referenceRange: "135 - 145",
            result: null,
          },
        ],
      },
      {
        subtestName: "Potassium",
        fields: [
          {
            fieldName: "Potassium",
            units: "mEq/L",
            referenceRange: "3.5 - 5.1",
            result: null,
          },
        ],
      },
      {
        subtestName: "Chloride",
        fields: [
          {
            fieldName: "Chloride",
            units: "mEq/L",
            referenceRange: "98 - 107",
            result: null,
          },
        ],
      },
      {
        subtestName: "Bicarbonate",
        fields: [
          {
            fieldName: "Bicarbonate",
            units: "mEq/L",
            referenceRange: "22 - 29",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 11,
    testName: "Hormone Panel",
    subtests: [
      {
        subtestName: "Testosterone",
        fields: [
          {
            fieldName: "Testosterone",
            units: "ng/dl",
            referenceRange: "300 - 1000",
            result: null,
          },
        ],
      },
      {
        subtestName: "Estradiol",
        fields: [
          {
            fieldName: "Estradiol",
            units: "pg/ml",
            referenceRange: "<40",
            result: null,
          },
        ],
      },
      {
        subtestName: "Progesterone",
        fields: [
          {
            fieldName: "Progesterone",
            units: "ng/ml",
            referenceRange: "1.8 - 24.0",
            result: null,
          },
        ],
      },
      {
        subtestName: "Luteinizing Hormone (LH)",
        fields: [
          {
            fieldName: "Luteinizing Hormone (LH)",
            units: "mIU/ml",
            referenceRange: "1.2 - 8.6",
            result: null,
          },
        ],
      },
      {
        subtestName: "Follicle-Stimulating Hormone (FSH)",
        fields: [
          {
            fieldName: "Follicle-Stimulating Hormone (FSH)",
            units: "mIU/ml",
            referenceRange: "1.4 - 15.4",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 12,
    testName: "Coagulation Profile",
    subtests: [
      {
        subtestName: "Prothrombin Time (PT)",
        fields: [
          {
            fieldName: "Prothrombin Time (PT)",
            units: "seconds",
            referenceRange: "11 - 13.5",
            result: null,
          },
        ],
      },
      {
        subtestName: "International Normalized Ratio (INR)",
        fields: [
          {
            fieldName: "International Normalized Ratio (INR)",
            units: "ratio",
            referenceRange: "0.8 - 1.1",
            result: null,
          },
        ],
      },
      {
        subtestName: "Activated Partial Thromboplastin Time (aPTT)",
        fields: [
          {
            fieldName: "Activated Partial Thromboplastin Time (aPTT)",
            units: "seconds",
            referenceRange: "25 - 35",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 13,
    testName: "C-Reactive Protein (CRP) Test",
    subtests: [
      {
        subtestName: "CRP Level",
        fields: [
          {
            fieldName: "CRP Level",
            units: "mg/L",
            referenceRange: "<3.0",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 14,
    testName: "Erythrocyte Sedimentation Rate (ESR)",
    subtests: [
      {
        subtestName: "ESR",
        fields: [
          {
            fieldName: "ESR",
            units: "mm/hr",
            referenceRange: "<20",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 15,
    testName: "HIV Test",
    subtests: [
      {
        subtestName: "HIV Antibodies",
        fields: [
          {
            fieldName: "HIV Antibodies",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
      {
        subtestName: "HIV RNA",
        fields: [
          {
            fieldName: "HIV RNA",
            units: "copies/ml",
            referenceRange: "Undetected",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 16,
    testName: "Tumor Marker Tests",
    subtests: [
      {
        subtestName: "PSA (Prostate-Specific Antigen)",
        fields: [
          {
            fieldName: "PSA (Prostate-Specific Antigen)",
            units: "ng/ml",
            referenceRange: "<4.0",
            result: null,
          },
        ],
      },
      {
        subtestName: "CA-125",
        fields: [
          {
            fieldName: "CA-125",
            units: "U/ml",
            referenceRange: "<35",
            result: null,
          },
        ],
      },
      {
        subtestName: "Alpha-fetoprotein (AFP)",
        fields: [
          {
            fieldName: "Alpha-fetoprotein (AFP)",
            units: "ng/ml",
            referenceRange: "<10",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 17,
    testName: "Pulmonary Function Test (PFT)",
    subtests: [
      {
        subtestName: "Forced Vital Capacity (FVC)",
        fields: [
          {
            fieldName: "Forced Vital Capacity (FVC)",
            units: "L",
            referenceRange: "80% - 120%",
            result: null,
          },
        ],
      },
      {
        subtestName: "Forced Expiratory Volume (FEV1)",
        fields: [
          {
            fieldName: "Forced Expiratory Volume (FEV1)",
            units: "L",
            referenceRange: "80% - 120%",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 18,
    testName: "Chest X-Ray",
    subtests: [
      {
        subtestName: "Chest Radiograph",
        fields: [
          {
            fieldName: "Chest Radiograph",
            units: "Image",
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 19,
    testName: "Bone Density Test (DEXA Scan)",
    subtests: [
      {
        subtestName: "T-Score",
        fields: [
          {
            fieldName: "T-Score",
            units: "Score",
            referenceRange: ">-1.0",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 20,
    testName: "Cardiac Enzyme Test",
    subtests: [
      {
        subtestName: "Troponin T",
        fields: [
          {
            fieldName: "Troponin T",
            units: "ng/ml",
            referenceRange: "<0.01",
            result: null,
          },
        ],
      },
      {
        subtestName: "Creatine Kinase-MB (CK-MB)",
        fields: [
          {
            fieldName: "Creatine Kinase-MB (CK-MB)",
            units: "ng/ml",
            referenceRange: "<4.3",
            result: null,
          },
        ],
      },
      {
        subtestName: "Myoglobin",
        fields: [
          {
            fieldName: "Myoglobin",
            units: "ng/ml",
            referenceRange: "<85",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 21,
    testName: "Blood Culture",
    subtests: [
      {
        subtestName: "Pathogen Identification",
        fields: [
          {
            fieldName: "Pathogen Identification",
            units: "Result",
            referenceRange: "No Growth",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 22,
    testName: "Hematology Panel",
    subtests: [
      {
        subtestName: "Reticulocyte Count",
        fields: [
          {
            fieldName: "Reticulocyte Count",
            units: "%",
            referenceRange: "0.5 - 2.5",
            result: null,
          },
        ],
      },
      {
        subtestName: "Mean Corpuscular Volume (MCV)",
        fields: [
          {
            fieldName: "Mean Corpuscular Volume (MCV)",
            units: "fL",
            referenceRange: "80 - 100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 23,
    testName: "Complete Blood Count (CBC)",
    subtests: [
      {
        subtestName: "Haemoglobin",
        fields: [
          {
            fieldName: "Haemoglobin",
            units: "g/dl",
            referenceRange: "13.0 - 17.0",
            result: null,
          },
        ],
      },
      {
        subtestName: "Total Leucocyte Count (TLC)",
        fields: [
          {
            fieldName: "Total Leucocyte Count (TLC)",
            units: "10^9/L",
            referenceRange: "4.0 - 10.0",
            result: null,
          },
        ],
      },
      {
        subtestName: "Packed Cell Volume",
        fields: [
          {
            fieldName: "Packed Cell Volume",
            units: "%",
            referenceRange: "40 - 50",
            result: null,
          },
        ],
      },
      {
        subtestName: "Platelet Count",
        fields: [
          {
            fieldName: "Platelet Count",
            units: "10^9/L",
            referenceRange: "150 - 450",
            result: null,
          },
        ],
      },
      {
        subtestName: "Red Blood Cell Count (RBC)",
        fields: [
          {
            fieldName: "Red Blood Cell Count (RBC)",
            units: "10^12/L",
            referenceRange: "4.5 - 5.5",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 24,
    testName: "Renal Panel",
    subtests: [
      {
        subtestName: "BUN/Creatinine Ratio",
        fields: [
          {
            fieldName: "BUN/Creatinine Ratio",
            units: "ratio",
            referenceRange: "10:1 - 20:1",
            result: null,
          },
        ],
      },
      {
        subtestName: "Phosphate",
        fields: [
          {
            fieldName: "Phosphate",
            units: "mg/dl",
            referenceRange: "2.5 - 4.5",
            result: null,
          },
        ],
      },
      {
        subtestName: "Calcium",
        fields: [
          {
            fieldName: "Calcium",
            units: "mg/dl",
            referenceRange: "8.5 - 10.5",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 25,
    testName: "Urinalysis",
    subtests: [
      {
        subtestName: "Specific Gravity",
        fields: [
          {
            fieldName: "Specific Gravity",
            units: "g/mL",
            referenceRange: "1.002 - 1.030",
            result: null,
          },
        ],
      },
      {
        subtestName: "pH",
        fields: [
          {
            fieldName: "pH",
            units: "Range",
            referenceRange: "4.6 - 8.0",
            result: null,
          },
        ],
      },
      {
        subtestName: "Glucose",
        fields: [
          {
            fieldName: "Glucose",
            units: "mg/dl",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
      {
        subtestName: "Ketones",
        fields: [
          {
            fieldName: "Ketones",
            units: "mg/dl",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 26,
    testName: "Electrocardiogram (ECG)",
    subtests: [
      {
        subtestName: "Heart Rate",
        fields: [
          {
            fieldName: "Heart Rate",
            units: "beats/minute",
            referenceRange: "60 - 100",
            result: null,
          },
        ],
      },
      {
        subtestName: "Rhythm",
        fields: [
          {
            fieldName: "Rhythm",
            units: "Pattern",
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
      {
        subtestName: "PR Interval",
        fields: [
          {
            fieldName: "PR Interval",
            units: "seconds",
            referenceRange: "0.12 - 0.20",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 27,
    testName: "Bacterial Vaginosis Test",
    subtests: [
      {
        subtestName: "Vaginal pH",
        fields: [
          {
            fieldName: "Vaginal pH",
            units: "Range",
            referenceRange: "4.0 - 4.5",
            result: null,
          },
        ],
      },
      {
        subtestName: "Whiff Test",
        fields: [
          {
            fieldName: "Whiff Test",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 28,
    testName: "Urine Drug Screen",
    subtests: [
      {
        subtestName: "Substance Detected",
        fields: [
          {
            fieldName: "Substance Detected",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
      {
        subtestName: "Number of Drugs Detected",
        fields: [
          {
            fieldName: "Number of Drugs Detected",
            units: "Count",
            referenceRange: "0",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 29,
    testName: "Blood Gas Analysis",
    subtests: [
      {
        subtestName: "pH",
        fields: [
          {
            fieldName: "pH",
            units: "Range",
            referenceRange: "7.35 - 7.45",
            result: null,
          },
        ],
      },
      {
        subtestName: "Partial Pressure of Carbon Dioxide (PCO2)",
        fields: [
          {
            fieldName: "Partial Pressure of Carbon Dioxide (PCO2)",
            units: "mmHg",
            referenceRange: "35 - 45",
            result: null,
          },
        ],
      },
      {
        subtestName: "Partial Pressure of Oxygen (PO2)",
        fields: [
          {
            fieldName: "Partial Pressure of Oxygen (PO2)",
            units: "mmHg",
            referenceRange: "80 - 100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 30,
    testName: "Semen Analysis",
    subtests: [
      {
        subtestName: "Volume",
        fields: [
          {
            fieldName: "Volume",
            units: "mL",
            referenceRange: "1.5 - 5.0",
            result: null,
          },
        ],
      },
      {
        subtestName: "Count",
        fields: [
          {
            fieldName: "Count",
            units: "Million/mL",
            referenceRange: ">15",
            result: null,
          },
        ],
      },
      {
        subtestName: "Motility",
        fields: [
          {
            fieldName: "Motility",
            units: "%",
            referenceRange: ">40",
            result: null,
          },
        ],
      },
      {
        subtestName: "Morphology",
        fields: [
          {
            fieldName: "Morphology",
            units: "%",
            referenceRange: ">30",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 31,
    testName: "Hemoglobin A1C",
    subtests: [
      {
        subtestName: "HbA1C Level",
        fields: [
          {
            fieldName: "HbA1C Level",
            units: "%",
            referenceRange: "4.0 - 6.0",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 32,
    testName: "Fertility Hormone Test",
    subtests: [
      {
        subtestName: "Anti-Mullerian Hormone (AMH)",
        fields: [
          {
            fieldName: "Anti-Mullerian Hormone (AMH)",
            units: "pmol/L",
            referenceRange: "2.0 - 8.9",
            result: null,
          },
        ],
      },
      {
        subtestName: "Follicle-Stimulating Hormone (FSH)",
        fields: [
          {
            fieldName: "Follicle-Stimulating Hormone (FSH)",
            units: "IU/L",
            referenceRange: "3.0 - 10.0",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 33,
    testName: "Bacterial Culture (Throat)",
    subtests: [
      {
        subtestName: "Pathogen Identification",
        fields: [
          {
            fieldName: "Pathogen Identification",
            units: "Result",
            referenceRange: "No Growth",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 34,
    testName: "Oxygen Saturation Test",
    subtests: [
      {
        subtestName: "SpO2 Level",
        fields: [
          {
            fieldName: "SpO2 Level",
            units: "%",
            referenceRange: "95 - 100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 35,
    testName: "Liver Enzymes",
    subtests: [
      {
        subtestName: "Gamma-glutamyl Transferase (GGT)",
        fields: [
          {
            fieldName: "Gamma-glutamyl Transferase (GGT)",
            units: "U/L",
            referenceRange: "9 - 48",
            result: null,
          },
        ],
      },
      {
        subtestName: "Lactate Dehydrogenase (LDH)",
        fields: [
          {
            fieldName: "Lactate Dehydrogenase (LDH)",
            units: "U/L",
            referenceRange: "140 - 280",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 36,
    testName: "Vitamin K Test",
    subtests: [
      {
        subtestName: "Prothrombin Time (PT)",
        fields: [
          {
            fieldName: "Prothrombin Time (PT)",
            units: "seconds",
            referenceRange: "11 - 13.5",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 37,
    testName: "Fasting Insulin Test",
    subtests: [
      {
        subtestName: "Fasting Insulin",
        fields: [
          {
            fieldName: "Fasting Insulin",
            units: "µU/mL",
            referenceRange: "2.6 - 24.9",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 38,
    testName: "Thyroglobulin Test",
    subtests: [
      {
        subtestName: "Thyroglobulin",
        fields: [
          {
            fieldName: "Thyroglobulin",
            units: "ng/mL",
            referenceRange: "<50",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 39,
    testName: "Urine Osmolality",
    subtests: [
      {
        subtestName: "Osmolality",
        fields: [
          {
            fieldName: "Osmolality",
            units: "mOsm/kg",
            referenceRange: "300 - 900",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 40,
    testName: "Salivary Cortisol Test",
    subtests: [
      {
        subtestName: "Cortisol Level",
        fields: [
          {
            fieldName: "Cortisol Level",
            units: "mcg/dL",
            referenceRange: "4 - 22",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 41,
    testName: "B-Type Natriuretic Peptide (BNP)",
    subtests: [
      {
        subtestName: "BNP Level",
        fields: [
          {
            fieldName: "BNP Level",
            units: "pg/mL",
            referenceRange: "<100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 42,
    testName: "Parathyroid Hormone (PTH)",
    subtests: [
      {
        subtestName: "PTH Level",
        fields: [
          {
            fieldName: "PTH Level",
            units: "pg/mL",
            referenceRange: "15 - 65",
            result: null,
          },
        ],
      },
      {
        subtestName: "Calcium",
        fields: [
          {
            fieldName: "Calcium",
            units: "mg/dL",
            referenceRange: "8.5 - 10.5",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 43,
    testName: "A1C",
    subtests: [
      {
        subtestName: "A1C Level",
        fields: [
          {
            fieldName: "A1C Level",
            units: "%",
            referenceRange: "4.0 - 6.0",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 44,
    testName: "Lactic Acid",
    subtests: [
      {
        subtestName: "Lactic Acid Level",
        fields: [
          {
            fieldName: "Lactic Acid Level",
            units: "mmol/L",
            referenceRange: "0.5 - 2.2",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 45,
    testName: "Ferritin",
    subtests: [
      {
        subtestName: "Ferritin Level",
        fields: [
          {
            fieldName: "Ferritin Level",
            units: "ng/mL",
            referenceRange: "30 - 300",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 46,
    testName: "Insulin Growth Factor-1 (IGF-1)",
    subtests: [
      {
        subtestName: "IGF-1 Level",
        fields: [
          {
            fieldName: "IGF-1 Level",
            units: "ng/mL",
            referenceRange: "76 - 216",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 47,
    testName: "Celiac Disease Panel",
    subtests: [
      {
        subtestName: "Tissue Transglutaminase (tTG) IgA",
        fields: [
          {
            fieldName: "Tissue Transglutaminase (tTG) IgA",
            units: "U/mL",
            referenceRange: "<20",
            result: null,
          },
        ],
      },
      {
        subtestName: "Total IgA",
        fields: [
          {
            fieldName: "Total IgA",
            units: "mg/dL",
            referenceRange: "70 - 400",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 48,
    testName: "Cardiac Troponin I",
    subtests: [
      {
        subtestName: "Troponin I Level",
        fields: [
          {
            fieldName: "Troponin I Level",
            units: "ng/L",
            referenceRange: "<0.04",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 49,
    testName: "Urine Creatinine",
    subtests: [
      {
        subtestName: "Creatinine Level",
        fields: [
          {
            fieldName: "Creatinine Level",
            units: "mg/dL",
            referenceRange: "0.6 - 1.2",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 50,
    testName: "Alpha-1 Antitrypsin (A1AT)",
    subtests: [
      {
        subtestName: "A1AT Level",
        fields: [
          {
            fieldName: "A1AT Level",
            units: "mg/dL",
            referenceRange: "90 - 200",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 51,
    testName: "D DIMER",
    subtests: [
      {
        subtestName: "D DIMER Level",
        fields: [
          {
            fieldName: "D DIMER Level",
            units: "ng/mL FEU",
            referenceRange: "<500",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 52,
    testName: "TORCH 10",
    subtests: [
      {
        subtestName: "Toxoplasmosis",
        fields: [
          {
            fieldName: "Toxoplasma IgG",
            units: "IU/mL",
            referenceRange: "<5.0",
            result: null,
          },
          {
            fieldName: "Toxoplasma IgM",
            units: "IU/mL",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
      {
        subtestName: "Rubella",
        fields: [
          {
            fieldName: "Rubella IgG",
            units: "IU/mL",
            referenceRange: ">10",
            result: null,
          },
          {
            fieldName: "Rubella IgM",
            units: "IU/mL",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
      {
        subtestName: "Cytomegalovirus (CMV)",
        fields: [
          {
            fieldName: "CMV IgG",
            units: "IU/mL",
            referenceRange: ">6",
            result: null,
          },
          {
            fieldName: "CMV IgM",
            units: "IU/mL",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
      {
        subtestName: "Herpes Simplex Virus (HSV)",
        fields: [
          {
            fieldName: "HSV-1 IgG",
            units: "IU/mL",
            referenceRange: ">1.1",
            result: null,
          },
          {
            fieldName: "HSV-2 IgG",
            units: "IU/mL",
            referenceRange: ">1.1",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 53,
    testName: "CA 125",
    subtests: [
      {
        subtestName: "CA 125 Level",
        fields: [
          {
            fieldName: "CA 125 Level",
            units: "U/mL",
            referenceRange: "<35",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 54,
    testName: "IgE LEVEL",
    subtests: [
      {
        subtestName: "Total IgE",
        fields: [
          {
            fieldName: "IgE Level",
            units: "IU/mL",
            referenceRange: "<100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 55,
    testName: "HbV DNA",
    subtests: [
      {
        subtestName: "Hepatitis B Virus DNA",
        fields: [
          {
            fieldName: "HBV DNA Level",
            units: "IU/mL",
            referenceRange: "Undetected",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 56,
    testName: "PTH",
    subtests: [
      {
        subtestName: "Parathyroid Hormone",
        fields: [
          {
            fieldName: "PTH Level",
            units: "pg/mL",
            referenceRange: "15 - 65",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 57,
    testName: "Iron Profile",
    subtests: [
      {
        subtestName: "Serum Iron",
        fields: [
          {
            fieldName: "Iron Level",
            units: "mcg/dL",
            referenceRange: "50 - 170",
            result: null,
          },
        ],
      },
      {
        subtestName: "Total Iron-Binding Capacity (TIBC)",
        fields: [
          {
            fieldName: "TIBC",
            units: "mcg/dL",
            referenceRange: "240 - 450",
            result: null,
          },
        ],
      },
      {
        subtestName: "Transferrin Saturation",
        fields: [
          {
            fieldName: "Transferrin Saturation",
            units: "%",
            referenceRange: "20 - 50",
            result: null,
          },
        ],
      },
      {
        subtestName: "Ferritin",
        fields: [
          {
            fieldName: "Ferritin Level",
            units: "ng/mL",
            referenceRange: "30 - 300",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 58,
    testName: "Anti CCP",
    subtests: [
      {
        subtestName: "Anti-Cyclic Citrullinated Peptide Antibody",
        fields: [
          {
            fieldName: "Anti CCP Level",
            units: "U/mL",
            referenceRange: "<20",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 59,
    testName: "ANA",
    subtests: [
      {
        subtestName: "Antinuclear Antibody (ANA) Test",
        fields: [
          {
            fieldName: "ANA Titer",
            units: "Titer",
            referenceRange: "<1:40",
            result: null,
          },
          {
            fieldName: "ANA Pattern",
            units: "Pattern",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 60,
    testName: "T3 Thyroid Function Test",
    subtests: [
      {
        subtestName: "Triiodothyronine (T3)",
        fields: [
          {
            fieldName: "Total T3",
            units: "ng/dL",
            referenceRange: "80 - 200",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 61,
    testName: "BILIRUBIN TOTAL & DIRECT",
    subtests: [
      {
        subtestName: "Total Bilirubin",
        fields: [
          {
            fieldName: "Total Bilirubin Level",
            units: "mg/dL",
            referenceRange: "0.1 - 1.2",
            result: null,
          },
        ],
      },
      {
        subtestName: "Direct Bilirubin",
        fields: [
          {
            fieldName: "Direct Bilirubin Level",
            units: "mg/dL",
            referenceRange: "0.0 - 0.3",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 62,
    testName: "CHIKUNGUNYA",
    subtests: [
      {
        subtestName: "Chikungunya Antibody Test",
        fields: [
          {
            fieldName: "IgM Antibodies",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
          {
            fieldName: "IgG Antibodies",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 63,
    testName: "KIDNEY FUNCTION TEST",
    subtests: [
      {
        subtestName: "Serum Urea",
        fields: [
          {
            fieldName: "Urea Level",
            units: "mg/dL",
            referenceRange: "10 - 50",
            result: null,
          },
        ],
      },
      {
        subtestName: "Serum Creatinine",
        fields: [
          {
            fieldName: "Creatinine Level",
            units: "mg/dL",
            referenceRange: "0.6 - 1.2",
            result: null,
          },
        ],
      },
      {
        subtestName: "Uric Acid",
        fields: [
          {
            fieldName: "Uric Acid Level",
            units: "mg/dL",
            referenceRange: "3.5 - 7.2",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 64,
    testName: "C-REACTIVE PROTEIN (CRP) LATEX",
    subtests: [
      {
        subtestName: "CRP Test",
        fields: [
          {
            fieldName: "CRP Level",
            units: "mg/L",
            referenceRange: "<10",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 65,
    testName: "WIDAL TEST (SLIDE METHOD)",
    subtests: [
      {
        subtestName: "Widal Test",
        fields: [
          {
            fieldName: "Salmonella Typhi O Antigen",
            units: "Titer",
            referenceRange: "<1:80",
            result: null,
          },
          {
            fieldName: "Salmonella Typhi H Antigen",
            units: "Titer",
            referenceRange: "<1:80",
            result: null,
          },
          {
            fieldName: "Salmonella Paratyphi A",
            units: "Titer",
            referenceRange: "<1:80",
            result: null,
          },
          {
            fieldName: "Salmonella Paratyphi B",
            units: "Titer",
            referenceRange: "<1:80",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 66,
    testName: "WIDAL TEST (SLIDE METHOD)",
    subtests: [
      {
        subtestName: "Widal Test",
        fields: [
          {
            fieldName: "Salmonella Typhi O Antigen",
            units: "Titer",
            referenceRange: "<1:80",
            result: null,
          },
          {
            fieldName: "Salmonella Typhi H Antigen",
            units: "Titer",
            referenceRange: "<1:80",
            result: null,
          },
          {
            fieldName: "Salmonella Paratyphi A",
            units: "Titer",
            referenceRange: "<1:80",
            result: null,
          },
          {
            fieldName: "Salmonella Paratyphi B",
            units: "Titer",
            referenceRange: "<1:80",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 67,
    testName: "HCB (RAPID CARD TEST)",
    subtests: [
      {
        subtestName: "HCB Rapid Test",
        fields: [
          {
            fieldName: "HCB Antibodies",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 68,
    testName: "KETONE BODIES",
    subtests: [
      {
        subtestName: "Ketone Test",
        fields: [
          {
            fieldName: "Ketone Bodies",
            units: "mg/dL",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 69,
    testName: "IRON PROFILE",
    subtests: [
      {
        subtestName: "Iron Levels",
        fields: [
          {
            fieldName: "Serum Iron",
            units: "mcg/dL",
            referenceRange: "60 - 170",
            result: null,
          },
          {
            fieldName: "Total Iron Binding Capacity (TIBC)",
            units: "mcg/dL",
            referenceRange: "240 - 450",
            result: null,
          },
          {
            fieldName: "Transferrin Saturation",
            units: "%",
            referenceRange: "20 - 50",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 70,
    testName: "ANTI TPO",
    subtests: [
      {
        subtestName: "Anti-Thyroid Peroxidase Antibody",
        fields: [
          {
            fieldName: "Anti-TPO Level",
            units: "IU/mL",
            referenceRange: "<35",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 71,
    testName: "ANA",
    subtests: [
      {
        subtestName: "Antinuclear Antibody Test",
        fields: [
          {
            fieldName: "ANA Titer",
            units: "Titer",
            referenceRange: "<1:80",
            result: null,
          },
          {
            fieldName: "ANA Pattern",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 72,
    testName: "DUAL MAKER",
    subtests: [
      {
        subtestName: "Hepatitis B and C Dual Marker Test",
        fields: [
          {
            fieldName: "Hepatitis B (HBsAg)",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
          {
            fieldName: "Hepatitis C (Anti-HCV)",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 73,
    testName: "HLA B(27)",
    subtests: [
      {
        subtestName: "HLA-B27 Antigen Test",
        fields: [
          {
            fieldName: "HLA-B27 Status",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 74,
    testName: "SERUM CREATININE",
    subtests: [
      {
        subtestName: "Serum Creatinine Level",
        fields: [
          {
            fieldName: "Creatinine Level",
            units: "mg/dL",
            referenceRange: "0.6 - 1.2",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 75,
    testName: "TROPONONE-T",
    subtests: [
      {
        subtestName: "Troponin T Test",
        fields: [
          {
            fieldName: "Troponin T Level",
            units: "ng/mL",
            referenceRange: "<0.01",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 76,
    testName: "DENGUE",
    subtests: [
      {
        subtestName: "Dengue NS1 Antigen Test",
        fields: [
          {
            fieldName: "NS1 Antigen",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
      {
        subtestName: "Dengue IgM/IgG Antibody Test",
        fields: [
          {
            fieldName: "IgM Antibody",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
          {
            fieldName: "IgG Antibody",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 77,
    testName: "TYPHIDOT",
    subtests: [
      {
        subtestName: "Typhidot Test",
        fields: [
          {
            fieldName: "IgM Antibody",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
          {
            fieldName: "IgG Antibody",
            units: "Result",
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 78,
    testName: "TOTAL PSA",
    subtests: [
      {
        subtestName: "Prostate-Specific Antigen (PSA) Test",
        fields: [
          {
            fieldName: "Total PSA Level",
            units: "ng/mL",
            referenceRange: "<4.0",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 79,
    testName: "URINE FOR PREGNANCY",
    subtests: [
      {
        subtestName: "Pregnancy Test",
        fields: [
          {
            fieldName: "hCG Level",
            units: "Result",
            referenceRange: "Positive or Negative",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 80,
    testName: "BRAIN NATRIURETIC PEPTIDE",
    subtests: [
      {
        subtestName: "Brain Natriuretic Peptide (BNP) Test",
        fields: [
          {
            fieldName: "BNP Level",
            units: "pg/mL",
            referenceRange: "<100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 81,
    testName: "PROCALCITONIN TEST(PCT)",
    subtests: [
      {
        subtestName: "Procalcitonin (PCT) Test",
        fields: [
          {
            fieldName: "Procalcitonin Level",
            units: "ng/mL",
            referenceRange: "<0.5",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 82,
    testName: "TOTAL SPA",
    subtests: [
      {
        subtestName: "Total Serum Prostatic Antigen (SPA) Test",
        fields: [
          {
            fieldName: "Total SPA Level",
            units: "ng/mL",
            referenceRange: "<4.0",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 83,
    testName: "Cardiac Enzyme Test",
    subtests: [
      {
        subtestName: "Troponin",
        fields: [
          {
            fieldName: "Troponin Level",
            units: "ng/mL",
            referenceRange: "<0.04",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 84,
    testName: "Ferritin Test",
    subtests: [
      {
        subtestName: "Serum Ferritin",
        fields: [
          {
            fieldName: "Ferritin Level",
            units: "ng/mL",
            referenceRange: "30-400",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 85,
    testName: "Progesterone Test",
    subtests: [
      {
        subtestName: "Serum Progesterone",
        fields: [
          {
            fieldName: "Progesterone Level",
            units: "ng/mL",
            referenceRange: "0.1-25",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 86,
    testName: "Helicobacter Pylori Test",
    subtests: [
      {
        subtestName: "H. Pylori Antibodies",
        fields: [
          {
            fieldName: "H. Pylori Status",
            units: null,
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 87,
    testName: "Rheumatoid Factor (RF) Test",
    subtests: [
      {
        subtestName: "RF Level",
        fields: [
          {
            fieldName: "RF",
            units: "IU/mL",
            referenceRange: "<15",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 88,
    testName: "Antinuclear Antibody (ANA) Test",
    subtests: [
      {
        subtestName: "ANA Titer",
        fields: [
          {
            fieldName: "ANA Result",
            units: null,
            referenceRange: "Negative",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 89,
    testName: "Zinc Test",
    subtests: [
      {
        subtestName: "Serum Zinc",
        fields: [
          {
            fieldName: "Zinc Level",
            units: "µg/dL",
            referenceRange: "70-150",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 90,
    testName: "Homocysteine Test",
    subtests: [
      {
        subtestName: "Homocysteine Level",
        fields: [
          {
            fieldName: "Homocysteine Level",
            units: "µmol/L",
            referenceRange: "4-15",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 91,
    testName: "Lipoprotein (a) Test",
    subtests: [
      {
        subtestName: "Lipoprotein (a)",
        fields: [
          {
            fieldName: "Lipoprotein (a) Level",
            units: "mg/dL",
            referenceRange: "<30",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 92,
    testName: "Homocysteine Test",
    subtests: [
      {
        subtestName: "Homocysteine Level",
        fields: [
          {
            fieldName: "Homocysteine Level",
            units: "µmol/L",
            referenceRange: "4-15",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 93,
    testName: "Phosphate Test",
    subtests: [
      {
        subtestName: "Serum Phosphate",
        fields: [
          {
            fieldName: "Phosphate Level",
            units: "mg/dL",
            referenceRange: "2.5-4.5",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 94,
    testName: "Pancreatic Enzyme Test",
    subtests: [
      {
        subtestName: "Lipase",
        fields: [
          {
            fieldName: "Lipase Level",
            units: "U/L",
            referenceRange: "10-140",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 95,
    testName: "Osmolality Test",
    subtests: [
      {
        subtestName: "Serum Osmolality",
        fields: [
          {
            fieldName: "Osmolality",
            units: "mOsm/kg",
            referenceRange: "275-295",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 96,
    testName: "Ceruloplasmin Test",
    subtests: [
      {
        subtestName: "Serum Ceruloplasmin",
        fields: [
          {
            fieldName: "Ceruloplasmin Level",
            units: "mg/dL",
            referenceRange: "20-50",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 97,
    testName: "Osmolality Test",
    subtests: [
      {
        subtestName: "Serum Osmolality",
        fields: [
          {
            fieldName: "Osmolality",
            units: "mOsm/kg",
            referenceRange: "275-295",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 98,
    testName: "Pancreatic Enzyme Test",
    subtests: [
      {
        subtestName: "Lipase",
        fields: [
          {
            fieldName: "Lipase Level",
            units: "U/L",
            referenceRange: "10-140",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 99,
    testName: "Thyroid Panel",
    subtests: [
      {
        subtestName: "Thyroid-Stimulating Hormone (TSH)",
        fields: [
          {
            fieldName: "TSH Level",
            units: "mIU/L",
            referenceRange: "0.4-4.0",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 100,
    testName: "Complement Test",
    subtests: [
      {
        subtestName: "C3 Complement",
        fields: [
          {
            fieldName: "C3 Level",
            units: "mg/dL",
            referenceRange: "90-180",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 101,
    testName: "Anti-DsDNA Antibody Test",
    subtests: [
      {
        subtestName: "Anti-DsDNA Level",
        fields: [
          {
            fieldName: "Antibody Level",
            units: "IU/mL",
            referenceRange: "<30",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 102,
    testName: "Cholinesterase Test",
    subtests: [
      {
        subtestName: "Serum Cholinesterase",
        fields: [
          {
            fieldName: "Cholinesterase Activity",
            units: "U/L",
            referenceRange: "5,320-12,920",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 103,
    testName: "Electrophoresis Test",
    subtests: [
      {
        subtestName: "Protein Electrophoresis",
        fields: [
          {
            fieldName: "Protein Fraction",
            units: "%",
            referenceRange: "Albumin: 55-65%",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 104,
    testName: "Rheumatoid Factor (RF) Test",
    subtests: [
      {
        subtestName: "RF Level",
        fields: [
          {
            fieldName: "RF",
            units: "IU/mL",
            referenceRange: "<14",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 105,
    testName: "Folate Test",
    subtests: [
      {
        subtestName: "Serum Folate",
        fields: [
          {
            fieldName: "Folate Level",
            units: "ng/mL",
            referenceRange: ">3",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 106,
    testName: "Amylase Test",
    subtests: [
      {
        subtestName: "Serum Amylase",
        fields: [
          {
            fieldName: "Amylase Level",
            units: "U/L",
            referenceRange: "30-110",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 107,
    testName: "Aldolase Test",
    subtests: [
      {
        subtestName: "Serum Aldolase",
        fields: [
          {
            fieldName: "Aldolase Level",
            units: "U/L",
            referenceRange: "<7.6",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 108,
    testName: "Cholinesterase Test",
    subtests: [
      {
        subtestName: "Serum Cholinesterase",
        fields: [
          {
            fieldName: "Cholinesterase Activity",
            units: "U/L",
            referenceRange: "5,320-12,920",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 109,
    testName: "Homocysteine Test",
    subtests: [
      {
        subtestName: "Homocysteine Level",
        fields: [
          {
            fieldName: "Homocysteine",
            units: "µmol/L",
            referenceRange: "4-15",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 110,
    testName: "Apolipoprotein Test",
    subtests: [
      {
        subtestName: "Apolipoprotein A1",
        fields: [
          {
            fieldName: "Apo A1 Level",
            units: "mg/dL",
            referenceRange: "100-200",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 111,
    testName: "Serum Copper Test",
    subtests: [
      {
        subtestName: "Copper Level",
        fields: [
          {
            fieldName: "Serum Copper",
            units: "µg/dL",
            referenceRange: "70-140",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 112,
    testName: "Fibrinogen Test",
    subtests: [
      {
        subtestName: "Fibrinogen Activity",
        fields: [
          {
            fieldName: "Fibrinogen Level",
            units: "mg/dL",
            referenceRange: "200-400",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 113,
    testName: "Chest X-Ray",
    subtests: [
      {
        subtestName: "Chest Imaging",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Abnormalities",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 114,
    testName: "Abdominal Ultrasound",
    subtests: [
      {
        subtestName: "Liver Assessment",
        fields: [
          {
            fieldName: "Liver Size and Echo Texture",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 115,
    testName: "MRI Brain",
    subtests: [
      {
        subtestName: "Brain Imaging",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Abnormalities",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 116,
    testName: "CT Scan Abdomen",
    subtests: [
      {
        subtestName: "CT Abdomen Imaging",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Pathology",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 117,
    testName: "Echocardiogram",
    subtests: [
      {
        subtestName: "Heart Chambers",
        fields: [
          {
            fieldName: "Left Ventricle Ejection Fraction (LVEF)",
            units: "%",
            referenceRange: "55-70",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 118,
    testName: "Bone Density Test (DEXA Scan)",
    subtests: [
      {
        subtestName: "Bone Mineral Density",
        fields: [
          {
            fieldName: "T-Score",
            units: null,
            referenceRange: ">-1.0",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 119,
    testName: "Mammogram",
    subtests: [
      {
        subtestName: "Breast Imaging",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Suspicious Masses",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 120,
    testName: "Spirometry Test",
    subtests: [
      {
        subtestName: "Lung Function",
        fields: [
          {
            fieldName: "Forced Vital Capacity (FVC)",
            units: "L",
            referenceRange: ">80%",
            result: null,
          },
          {
            fieldName: "Forced Expiratory Volume (FEV1)",
            units: "L",
            referenceRange: ">80%",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 121,
    testName: "Electrocardiogram (ECG)",
    subtests: [
      {
        subtestName: "Heart Rhythm",
        fields: [
          {
            fieldName: "Heart Rate",
            units: "bpm",
            referenceRange: "60-100",
            result: null,
          },
          {
            fieldName: "Rhythm Analysis",
            units: null,
            referenceRange: "Normal Sinus Rhythm",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 122,
    testName: "Pulmonary Function Test (PFT)",
    subtests: [
      {
        subtestName: "Lung Volumes",
        fields: [
          {
            fieldName: "Total Lung Capacity (TLC)",
            units: "L",
            referenceRange: "4.5-6.5",
            result: null,
          },
        ],
      },
      {
        subtestName: "Diffusion Capacity",
        fields: [
          {
            fieldName: "DLCO",
            units: "mL/min/mmHg",
            referenceRange: ">80%",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 123,
    testName: "PET Scan",
    subtests: [
      {
        subtestName: "Metabolic Activity",
        fields: [
          {
            fieldName: "Standard Uptake Value (SUV)",
            units: null,
            referenceRange: "No Significant Uptake",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 124,
    testName: "Barium Swallow Test",
    subtests: [
      {
        subtestName: "Esophageal Function",
        fields: [
          {
            fieldName: "Barium Flow",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 125,
    testName: "Colonoscopy",
    subtests: [
      {
        subtestName: "Colonic Examination",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Polyps or Lesions",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 126,
    testName: "Endoscopy",
    subtests: [
      {
        subtestName: "Upper GI Tract Examination",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Abnormalities",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 127,
    testName: "Electroencephalogram (EEG)",
    subtests: [
      {
        subtestName: "Brain Activity",
        fields: [
          {
            fieldName: "Waveform Analysis",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 128,
    testName: "Holter Monitor Test",
    subtests: [
      {
        subtestName: "24-Hour ECG Monitoring",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Arrhythmia",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 129,
    testName: "Stress Test",
    subtests: [
      {
        subtestName: "Cardiac Response to Stress",
        fields: [
          {
            fieldName: "Heart Rate Response",
            units: "bpm",
            referenceRange: "Appropriate for Age",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 130,
    testName: "DEXA Scan for Body Composition",
    subtests: [
      {
        subtestName: "Body Fat Percentage",
        fields: [
          {
            fieldName: "Fat Percentage",
            units: "%",
            referenceRange: "10-30",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 131,
    testName: "Audiometry Test",
    subtests: [
      {
        subtestName: "Hearing Thresholds",
        fields: [
          {
            fieldName: "Frequency Range",
            units: "Hz",
            referenceRange: "250-8000",
            result: null,
          },
          {
            fieldName: "Hearing Loss Level",
            units: "dB",
            referenceRange: "<25",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 132,
    testName: "Visual Field Test",
    subtests: [
      {
        subtestName: "Peripheral Vision",
        fields: [
          {
            fieldName: "Field Loss",
            units: null,
            referenceRange: "No Defects",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 133,
    testName: "Thyroid Scan",
    subtests: [
      {
        subtestName: "Thyroid Imaging",
        fields: [
          {
            fieldName: "Uptake Percentage",
            units: "%",
            referenceRange: "5-25",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 134,
    testName: "Carotid Doppler",
    subtests: [
      {
        subtestName: "Carotid Artery Assessment",
        fields: [
          {
            fieldName: "Plaque Detection",
            units: null,
            referenceRange: "No Significant Plaque",
            result: null,
          },
          {
            fieldName: "Peak Systolic Velocity",
            units: "cm/s",
            referenceRange: "<125",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 135,
    testName: "Sleep Study (Polysomnography)",
    subtests: [
      {
        subtestName: "Sleep Parameters",
        fields: [
          {
            fieldName: "Apnea-Hypopnea Index (AHI)",
            units: "events/hour",
            referenceRange: "<5",
            result: null,
          },
          {
            fieldName: "Oxygen Saturation",
            units: "%",
            referenceRange: ">90",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 136,
    testName: "HIDA Scan",
    subtests: [
      {
        subtestName: "Gallbladder Function",
        fields: [
          {
            fieldName: "Ejection Fraction",
            units: "%",
            referenceRange: ">35",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 137,
    testName: "Allergy Skin Test",
    subtests: [
      {
        subtestName: "Allergen Sensitivity",
        fields: [
          {
            fieldName: "Reaction Size",
            units: "mm",
            referenceRange: "<3",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 138,
    testName: "Bronchoscopy",
    subtests: [
      {
        subtestName: "Airway Examination",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Obstruction",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 139,
    testName: "Capsule Endoscopy",
    subtests: [
      {
        subtestName: "Small Intestine Assessment",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Abnormalities",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 140,
    testName: "Hearing Test (Pure Tone Audiometry)",
    subtests: [
      {
        subtestName: "Audiometric Threshold",
        fields: [
          {
            fieldName: "Threshold Level",
            units: "dB",
            referenceRange: "<25",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 141,
    testName: "Tilt Table Test",
    subtests: [
      {
        subtestName: "Autonomic Function",
        fields: [
          {
            fieldName: "Heart Rate Response",
            units: "bpm",
            referenceRange: "Appropriate for Position",
            result: null,
          },
          {
            fieldName: "Blood Pressure Response",
            units: "mmHg",
            referenceRange: "No Abnormal Drop",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 142,
    testName: "Sweat Chloride Test",
    subtests: [
      {
        subtestName: "Cystic Fibrosis Screening",
        fields: [
          {
            fieldName: "Chloride Concentration",
            units: "mmol/L",
            referenceRange: "<60",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 143,
    testName: "Videonystagmography (VNG)",
    subtests: [
      {
        subtestName: "Balance Assessment",
        fields: [
          {
            fieldName: "Nystagmus Presence",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 144,
    testName: "Intravenous Pyelogram (IVP)",
    subtests: [
      {
        subtestName: "Kidney Imaging",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 145,
    testName: "EMG (Electromyography)",
    subtests: [
      {
        subtestName: "Muscle Activity",
        fields: [
          {
            fieldName: "Amplitude",
            units: "mV",
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 146,
    testName: "Nerve Conduction Study (NCS)",
    subtests: [
      {
        subtestName: "Nerve Function",
        fields: [
          {
            fieldName: "Conduction Velocity",
            units: "m/s",
            referenceRange: ">50",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 147,
    testName: "Liver FibroScan",
    subtests: [
      {
        subtestName: "Liver Stiffness",
        fields: [
          {
            fieldName: "Stiffness Measurement",
            units: "kPa",
            referenceRange: "<7",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 148,
    testName: "Breast MRI",
    subtests: [
      {
        subtestName: "Breast Tissue Imaging",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Suspicious Lesions",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 149,
    testName: "Transesophageal Echocardiogram (TEE)",
    subtests: [
      {
        subtestName: "Cardiac Imaging",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Abnormalities",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 150,
    testName: "Fetal Ultrasound",
    subtests: [
      {
        subtestName: "Fetal Growth",
        fields: [
          {
            fieldName: "Crown-Rump Length (CRL)",
            units: "mm",
            referenceRange: "Appropriate for Gestation",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 151,
    testName: "Venous Doppler",
    subtests: [
      {
        subtestName: "Venous Blood Flow",
        fields: [
          {
            fieldName: "Valve Function",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 152,
    testName: "Bone Scan",
    subtests: [
      {
        subtestName: "Bone Activity",
        fields: [
          {
            fieldName: "Uptake Areas",
            units: null,
            referenceRange: "No Abnormal Uptake",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 153,
    testName: "Abdominal CT Scan",
    subtests: [
      {
        subtestName: "Liver and Kidney Assessment",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Abnormalities",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 154,
    testName: "Cardiac MRI",
    subtests: [
      {
        subtestName: "Heart Function Analysis",
        fields: [
          {
            fieldName: "Ejection Fraction",
            units: "%",
            referenceRange: "55-70",
            result: null,
          },
          {
            fieldName: "Chamber Size",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 155,
    testName: "Renal Doppler",
    subtests: [
      {
        subtestName: "Kidney Blood Flow",
        fields: [
          {
            fieldName: "Resistive Index",
            units: null,
            referenceRange: "<0.7",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 156,
    testName: "CT Angiography",
    subtests: [
      {
        subtestName: "Vascular Imaging",
        fields: [
          {
            fieldName: "Stenosis Level",
            units: "%",
            referenceRange: "<50",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 157,
    testName: "Esophageal Manometry",
    subtests: [
      {
        subtestName: "Esophageal Motility",
        fields: [
          {
            fieldName: "Lower Esophageal Sphincter Pressure",
            units: "mmHg",
            referenceRange: "10-35",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 158,
    testName: "Coronary Calcium Score",
    subtests: [
      {
        subtestName: "Calcium Deposition",
        fields: [
          {
            fieldName: "Agatston Score",
            units: null,
            referenceRange: "<100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 159,
    testName: "Upper GI Barium Series",
    subtests: [
      {
        subtestName: "Esophageal and Stomach Assessment",
        fields: [
          {
            fieldName: "Barium Flow",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 160,
    testName: "Thyroid Ultrasound",
    subtests: [
      {
        subtestName: "Thyroid Nodule Assessment",
        fields: [
          {
            fieldName: "Nodule Size",
            units: "cm",
            referenceRange: "<1",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 161,
    testName: "Hysterosalpingography",
    subtests: [
      {
        subtestName: "Fallopian Tube Patency",
        fields: [
          {
            fieldName: "Tubal Blockage",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 162,
    testName: "Scrotal Ultrasound",
    subtests: [
      {
        subtestName: "Testicular Assessment",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Mass or Fluid",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 163,
    testName: "Urodynamic Study",
    subtests: [
      {
        subtestName: "Bladder Function",
        fields: [
          {
            fieldName: "Bladder Capacity",
            units: "mL",
            referenceRange: "300-500",
            result: null,
          },
          {
            fieldName: "Post-Void Residual Volume",
            units: "mL",
            referenceRange: "<50",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 164,
    testName: "Abdominal MRI",
    subtests: [
      {
        subtestName: "Organ Imaging",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Abnormalities",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 165,
    testName: "Parathyroid Scan",
    subtests: [
      {
        subtestName: "Parathyroid Function",
        fields: [
          {
            fieldName: "Uptake Pattern",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 166,
    testName: "Transcranial Doppler",
    subtests: [
      {
        subtestName: "Cerebral Blood Flow",
        fields: [
          {
            fieldName: "Flow Velocity",
            units: "cm/s",
            referenceRange: "30-80",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 167,
    testName: "DEXA Scan for Fracture Risk",
    subtests: [
      {
        subtestName: "Bone Strength",
        fields: [
          {
            fieldName: "T-Score",
            units: null,
            referenceRange: ">-2.5",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 168,
    testName: "Lung Perfusion Scan",
    subtests: [
      {
        subtestName: "Pulmonary Blood Flow",
        fields: [
          {
            fieldName: "Perfusion Defects",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 169,
    testName: "Gallium Scan",
    subtests: [
      {
        subtestName: "Inflammation Detection",
        fields: [
          {
            fieldName: "Gallium Uptake",
            units: null,
            referenceRange: "No Uptake",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 170,
    testName: "PET-CT for Cancer Staging",
    subtests: [
      {
        subtestName: "Tumor Metabolic Activity",
        fields: [
          {
            fieldName: "SUV Max",
            units: null,
            referenceRange: "<2.5",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 171,
    testName: "Capsule Endoscopy for Small Intestine",
    subtests: [
      {
        subtestName: "Intestinal Lesion Detection",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Lesions",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 172,
    testName: "Electrophysiology Study (EPS)",
    subtests: [
      {
        subtestName: "Cardiac Electrical Activity",
        fields: [
          {
            fieldName: "Conduction Abnormalities",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 173,
    testName: "Virtual Colonoscopy",
    subtests: [
      {
        subtestName: "Colon Imaging",
        fields: [
          {
            fieldName: "Polyp Detection",
            units: null,
            referenceRange: "None Detected",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 174,
    testName: "Spinal MRI",
    subtests: [
      {
        subtestName: "Spinal Cord Assessment",
        fields: [
          {
            fieldName: "Disc Herniation",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 175,
    testName: "Stress Echocardiography",
    subtests: [
      {
        subtestName: "Heart Function Under Stress",
        fields: [
          {
            fieldName: "Wall Motion Abnormalities",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 176,
    testName: "Ankle-Brachial Index (ABI)",
    subtests: [
      {
        subtestName: "Peripheral Artery Disease Screening",
        fields: [
          {
            fieldName: "ABI Ratio",
            units: null,
            referenceRange: "0.9-1.3",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 177,
    testName: "Electroretinography (ERG)",
    subtests: [
      {
        subtestName: "Retinal Function",
        fields: [
          {
            fieldName: "Amplitude",
            units: "µV",
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 178,
    testName: "Gastrointestinal Motility Study",
    subtests: [
      {
        subtestName: "Gut Movement Analysis",
        fields: [
          {
            fieldName: "Transit Time",
            units: "hours",
            referenceRange: "<48",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 179,
    testName: "Sialography",
    subtests: [
      {
        subtestName: "Salivary Gland Imaging",
        fields: [
          {
            fieldName: "Duct Blockage",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 180,
    testName: "Video Capsule Endoscopy",
    subtests: [
      {
        subtestName: "Gastrointestinal Imaging",
        fields: [
          {
            fieldName: "Bleeding Detection",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 181,
    testName: "Evoked Potentials Test",
    subtests: [
      {
        subtestName: "Nerve Signal Transmission",
        fields: [
          {
            fieldName: "Latency",
            units: "ms",
            referenceRange: "<100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 182,
    testName: "Fluoroscopy",
    subtests: [
      {
        subtestName: "Dynamic Imaging",
        fields: [
          {
            fieldName: "Movement Abnormalities",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 183,
    testName: "CT Enterography",
    subtests: [
      {
        subtestName: "Small Bowel Imaging",
        fields: [
          {
            fieldName: "Inflammation",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 184,
    testName: "Whole Body PET Scan",
    subtests: [
      {
        subtestName: "Metabolic Activity Detection",
        fields: [
          {
            fieldName: "SUV Max",
            units: null,
            referenceRange: "<2.5",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 185,
    testName: "Digital Mammography",
    subtests: [
      {
        subtestName: "Breast Imaging",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Suspicious Lesions",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 186,
    testName: "Biliary Scan",
    subtests: [
      {
        subtestName: "Gallbladder Function",
        fields: [
          {
            fieldName: "Ejection Fraction",
            units: "%",
            referenceRange: ">35",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 187,
    testName: "Renal Nuclear Scan",
    subtests: [
      {
        subtestName: "Kidney Function",
        fields: [
          {
            fieldName: "Perfusion",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 188,
    testName: "Cardiac Stress Test",
    subtests: [
      {
        subtestName: "Cardiac Function Under Stress",
        fields: [
          {
            fieldName: "Heart Rate Response",
            units: "bpm",
            referenceRange: "Normal",
            result: null,
          },
          {
            fieldName: "ECG Changes",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 189,
    testName: "Dual Source CT",
    subtests: [
      {
        subtestName: "Detailed Organ Imaging",
        fields: [
          {
            fieldName: "Lesions",
            units: null,
            referenceRange: "None Detected",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 190,
    testName: "High Resolution CT (HRCT)",
    subtests: [
      {
        subtestName: "Lung Assessment",
        fields: [
          {
            fieldName: "Fibrosis",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 191,
    testName: "Skin Biopsy",
    subtests: [
      {
        subtestName: "Tissue Analysis",
        fields: [
          {
            fieldName: "Histological Findings",
            units: null,
            referenceRange: "No Malignancy",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 192,
    testName: "Visual Field Test",
    subtests: [
      {
        subtestName: "Peripheral Vision Assessment",
        fields: [
          {
            fieldName: "Defects",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 193,
    testName: "Myelography",
    subtests: [
      {
        subtestName: "Spinal Canal Imaging",
        fields: [
          {
            fieldName: "Compression or Lesions",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 194,
    testName: "Cardiac Catheterization",
    subtests: [
      {
        subtestName: "Coronary Artery Examination",
        fields: [
          {
            fieldName: "Stenosis Level",
            units: "%",
            referenceRange: "<50",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 195,
    testName: "Arterial Blood Gas (ABG)",
    subtests: [
      {
        subtestName: "Respiratory Function",
        fields: [
          {
            fieldName: "pH",
            units: null,
            referenceRange: "7.35-7.45",
            result: null,
          },
          {
            fieldName: "PaO2",
            units: "mmHg",
            referenceRange: "75-100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 196,
    testName: "Esophagogastroduodenoscopy (EGD)",
    subtests: [
      {
        subtestName: "Upper GI Tract Examination",
        fields: [
          {
            fieldName: "Ulcers or Lesions",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 197,
    testName: "Abdominal X-Ray",
    subtests: [
      {
        subtestName: "Abdominal Imaging",
        fields: [
          {
            fieldName: "Blockages or Abnormalities",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 198,
    testName: "Sex Hormone Binding Globulin (SHBG)",
    subtests: [
      {
        subtestName: "SHBG Level Assessment",
        fields: [
          {
            fieldName: "SHBG Level",
            units: "nmol/L",
            referenceRange: "10-70",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 199,
    testName: "Free Androgen Index (FAI)",
    subtests: [
      {
        subtestName: "Androgen Availability",
        fields: [
          {
            fieldName: "FAI",
            units: "%",
            referenceRange: "15-50",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 200,
    testName: "17-Hydroxyprogesterone",
    subtests: [
      {
        subtestName: "Adrenal Hormone Assessment",
        fields: [
          {
            fieldName: "17-Hydroxyprogesterone Level",
            units: "ng/mL",
            referenceRange: "0.2-1.3",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 201,
    testName: "Anti-Müllerian Hormone (AMH)",
    subtests: [
      {
        subtestName: "Ovarian Reserve Assessment",
        fields: [
          {
            fieldName: "AMH Level",
            units: "ng/mL",
            referenceRange: "1-4",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 202,
    testName: "Prolactin Test",
    subtests: [
      {
        subtestName: "Prolactin Level",
        fields: [
          {
            fieldName: "Prolactin Level",
            units: "ng/mL",
            referenceRange: "4-23",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 203,
    testName: "Luteinizing Hormone (LH)",
    subtests: [
      {
        subtestName: "LH Level Assessment",
        fields: [
          {
            fieldName: "LH Level",
            units: "mIU/mL",
            referenceRange: "1-20",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 204,
    testName: "Follicle-Stimulating Hormone (FSH)",
    subtests: [
      {
        subtestName: "FSH Level Measurement",
        fields: [
          {
            fieldName: "FSH Level",
            units: "mIU/mL",
            referenceRange: "3-10",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 205,
    testName: "Estradiol Test (E2)",
    subtests: [
      {
        subtestName: "Estradiol Level",
        fields: [
          {
            fieldName: "Estradiol Level",
            units: "pg/mL",
            referenceRange: "30-400",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 206,
    testName: "Testosterone Test",
    subtests: [
      {
        subtestName: "Total Testosterone",
        fields: [
          {
            fieldName: "Testosterone Level",
            units: "ng/dL",
            referenceRange: "300-1000",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 207,
    testName: "Dehydroepiandrosterone Sulfate (DHEAS)",
    subtests: [
      {
        subtestName: "Adrenal Hormone Levels",
        fields: [
          {
            fieldName: "DHEAS Level",
            units: "µg/dL",
            referenceRange: "70-495",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 208,
    testName: "Cortisol Test",
    subtests: [
      {
        subtestName: "Serum Cortisol",
        fields: [
          {
            fieldName: "Cortisol Level",
            units: "µg/dL",
            referenceRange: "6-23",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 209,
    testName: "Growth Hormone (GH)",
    subtests: [
      {
        subtestName: "GH Level Assessment",
        fields: [
          {
            fieldName: "GH Level",
            units: "ng/mL",
            referenceRange: "0.4-7.0",
            result: null,
          },
        ],
      },
    ],
  },

  {
    id: 210,
    testName: "Bone Scan",
    subtests: [
      {
        subtestName: "Skeletal Abnormalities",
        fields: [
          {
            fieldName: "Radioactive Uptake",
            units: null,
            referenceRange: "No Hot Spots",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 211,
    testName: "Myelography",
    subtests: [
      {
        subtestName: "Spinal Canal Imaging",
        fields: [
          {
            fieldName: "Compression or Lesions",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 212,
    testName: "Cardiac Catheterization",
    subtests: [
      {
        subtestName: "Coronary Artery Examination",
        fields: [
          {
            fieldName: "Stenosis Level",
            units: "%",
            referenceRange: "<50",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 213,
    testName: "Cholangiography",
    subtests: [
      {
        subtestName: "Bile Duct Examination",
        fields: [
          {
            fieldName: "Obstruction",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 214,
    testName: "Transesophageal Echocardiogram",
    subtests: [
      {
        subtestName: "Heart Valve Assessment",
        fields: [
          {
            fieldName: "Valve Function",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 215,
    testName: "Electromyography (EMG)",
    subtests: [
      {
        subtestName: "Muscle Activity Analysis",
        fields: [
          {
            fieldName: "Electrical Activity",
            units: null,
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 216,
    testName: "Audiometry Test",
    subtests: [
      {
        subtestName: "Hearing Threshold Assessment",
        fields: [
          {
            fieldName: "Hearing Threshold",
            units: "dB",
            referenceRange: "0-25",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 217,
    testName: "Videonystagmography (VNG)",
    subtests: [
      {
        subtestName: "Balance and Inner Ear Function",
        fields: [
          {
            fieldName: "Nystagmus",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 218,
    testName: "Arterial Blood Gas (ABG)",
    subtests: [
      {
        subtestName: "Respiratory Function",
        fields: [
          {
            fieldName: "pH",
            units: null,
            referenceRange: "7.35-7.45",
            result: null,
          },
          {
            fieldName: "PaO2",
            units: "mmHg",
            referenceRange: "75-100",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 219,
    testName: "Pulmonary Function Test (PFT)",
    subtests: [
      {
        subtestName: "Lung Capacity and Flow",
        fields: [
          {
            fieldName: "FEV1",
            units: "L",
            referenceRange: ">80%",
            result: null,
          },
          {
            fieldName: "FVC",
            units: "L",
            referenceRange: ">80%",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 220,
    testName: "Fetal Ultrasound",
    subtests: [
      {
        subtestName: "Fetal Growth Monitoring",
        fields: [
          {
            fieldName: "Crown-Rump Length",
            units: "cm",
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 221,
    testName: "Holter Monitor",
    subtests: [
      {
        subtestName: "24-Hour ECG Monitoring",
        fields: [
          {
            fieldName: "Arrhythmia",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 222,
    testName: "Sleep Study (Polysomnography)",
    subtests: [
      {
        subtestName: "Sleep Pattern Analysis",
        fields: [
          {
            fieldName: "Apnea-Hypopnea Index",
            units: null,
            referenceRange: "<5",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 223,
    testName: "Sweat Chloride Test",
    subtests: [
      {
        subtestName: "Cystic Fibrosis Screening",
        fields: [
          {
            fieldName: "Chloride Level",
            units: "mmol/L",
            referenceRange: "<60",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 224,
    testName: "Cystoscopy",
    subtests: [
      {
        subtestName: "Bladder Examination",
        fields: [
          {
            fieldName: "Findings",
            units: null,
            referenceRange: "No Lesions",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 225,
    testName: "Esophagogastroduodenoscopy (EGD)",
    subtests: [
      {
        subtestName: "Upper GI Tract Examination",
        fields: [
          {
            fieldName: "Ulcers or Lesions",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 226,
    testName: "Hearing Test",
    subtests: [
      {
        subtestName: "Hearing Function Assessment",
        fields: [
          {
            fieldName: "Hearing Loss",
            units: "dB",
            referenceRange: "<20",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 227,
    testName: "Liver Fibroscan",
    subtests: [
      {
        subtestName: "Liver Stiffness Measurement",
        fields: [
          {
            fieldName: "Fibrosis Score",
            units: "kPa",
            referenceRange: "<7",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 228,
    testName: "Nerve Conduction Study (NCS)",
    subtests: [
      {
        subtestName: "Nerve Signal Speed",
        fields: [
          {
            fieldName: "Conduction Velocity",
            units: "m/s",
            referenceRange: "Normal",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 229,
    testName: "Abdominal X-Ray",
    subtests: [
      {
        subtestName: "Abdominal Imaging",
        fields: [
          {
            fieldName: "Blockages or Abnormalities",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 230,
    testName: "Dual Source CT",
    subtests: [
      {
        subtestName: "Detailed Organ Imaging",
        fields: [
          {
            fieldName: "Lesions",
            units: null,
            referenceRange: "None Detected",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 231,
    testName: "High Resolution CT (HRCT)",
    subtests: [
      {
        subtestName: "Lung Assessment",
        fields: [
          {
            fieldName: "Fibrosis",
            units: null,
            referenceRange: "Absent",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 232,
    testName: "Skin Biopsy",
    subtests: [
      {
        subtestName: "Tissue Analysis",
        fields: [
          {
            fieldName: "Histological Findings",
            units: null,
            referenceRange: "No Malignancy",
            result: null,
          },
        ],
      },
    ],
  },
  {
    id: 233,
    testName: "Visual Field Test",
    subtests: [
      {
        subtestName: "Peripheral Vision Assessment",
        fields: [
          {
            fieldName: "Defects",
            units: null,
            referenceRange: "None",
            result: null,
          },
        ],
      },
    ],
  },
];

// Define a route to fetch all test names
router.get("/api/testnames", (req, res) => {
  console.log("testnames endpoint hit");
  const testNames = tests.map((test) => test.testName);
  res.json({ testNames });
});

// Define a route to fetch test details by test name
router.get("/api/tests", (req, res) => {
  console.log("tests", tests);
  res.json({ tests });
});

// Define a route to fetch test details by ID
router.get("/api/testdetails/id/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const test = tests.find((t) => t.id === id);

  if (test) {
    res.json(test);
  } else {
    res.status(404).json({ error: "Test not found" });
  }
});

module.exports = router;
