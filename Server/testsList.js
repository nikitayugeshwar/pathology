module.exports = [
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
];
