import mongoose, { Schema } from "mongoose";

/*
  === SOS ==
  los reportes tienen ciclos donde cada ciclo tiene varias rutas
  a cada ruta se le genera un cuestionario (checklist)

  == EOS ==
  tambien los reportes tienen tiempos donde se generan otros cuestionarios

  == AM ==
  las task son los cuestionarios para los manager

  NOTA: los niveles T1, T2, YM, y AM  son colocados en el checklist
*/

const SiteReports = new Schema({
  // SOS
  site: {
    type: Schema.Types.ObjectId,
    required: "site is required",
    ref: "sites"
  },
  cycles: [{
    cycle: {
      type: Number,
      required: "cycle is required"
    },
    waves: [{
      wave: {
        type: Number,
        required: "cycle wave is required"
      },
      checklists: [{
        level: {
          type: String,
          required: "level is required"
        },
        disabled: {
          type: Boolean,
          default: false
        },
        checklist: {
          type: Schema.Types.ObjectId,
          required: "wave checklist is required",
          ref: "checklists"
        }
      }]
    }]
  }],
  // EOS
  times: [{
    time: {
      type: Date,
      required: "time is required"
    },
    checklists: [{
      level: {
        type: String,
        required: "level is required"
      },
      disabled: {
        type: Boolean,
        default: false
      },
      checklist: {
        type: Schema.Types.ObjectId,
        required: "wave checklist is required",
        ref: "checklists"
      }
    }]
  }],
  // MANAGER (AM)
  tasks: [{
    task: {
      type: String,
      required: "task is required"
    },
    checklists: [{
      level: {
        type: String,
        required: "level is required"
      },
      checklist: {
        type: Schema.Types.ObjectId,
        required: "wave checklist is required",
        ref: "checklists"
      }
    }]
  }]
},
{
  timestamps: true
});

export default mongoose.model("siteReports", SiteReports);
