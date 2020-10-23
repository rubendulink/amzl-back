import mongoose, { Schema } from "mongoose";

const safety = new Schema(
  {
    user: {
      type: String
    },
    date: {
      type: Date
    },
    site: {
      type: Schema.Types.ObjectId,
      required: "site is required",
      ref: "sites"
    },
    incidentType: {
      type: String
    },
    // step 1
    incidentDescription: {
      type: String
    },
    requireMedicalAtention: {
      type: Boolean
    },
    locationMedicalAtention: {
      type: String
    },
    driverContactNumber: {
      type: String
    },
    driverHireDate: {
      type: String
    },
    driverHireDateOriginal: {
      type: String
    },
    ficoScore: {
      type: Number
    },
    anyPreviousIncident: {
      type: Boolean
    },
    // step 2
    vehicleTypesInvolved: {
      type: String
    },
    vehicleChecklistCompleted: {
      boolean: {
        type: Boolean
      },
      comment: {
        type: String
      }
    },
    preTrip_Inspection: {
      boolean: {
        type: Boolean
      },
      comment: {
        type: String
      }
    },
    environmental_factors: {
      boolean: {
        type: Boolean
      },
      comment: {
        type: String
      }
    },
    selfReportIncident: {
      type: Boolean
    },
    driver_be_fault: {
      boolean: {
        type: Boolean
      },
      comment: {
        type: String
      }
    },
    vehicleRequireMaintenance: {
      type: Boolean
    },
    // step 3
    policeReport: {
      type: String
    },
    policePresence: {
      type: String
    },
    drugTestCompleted: {
      type: Boolean
    },
    disciplinaryAction: {
      type: String
    },
    details: {
      type: String
    },
    rootCause: {
      type: String
    },
    correctiveAction: {
      type: String
    },
    GOOGLE_EARTH: {
      key: {
        type: String
      },
      url: {
        type: String
      }
    },
    VEHICLE_PICTURE: {
      key: {
        type: String
      },
      url: {
        type: String
      }
    }
  }
);

export default mongoose.model("safety", safety);
