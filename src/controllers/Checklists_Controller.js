import Checklists from "../models/Checklists";
import colors from "colors";
import { validObjectId } from "../helpers/mongoose";

export const updateReportChecklist = async (req, res) => {

  const { id } = req.params;
  const data = req.body;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let checklist;
  try {

    checklist = await Checklists.findById(id);
    if (!checklist) {

      return res.status(400).json({ message: "Checklist not exist or was delete it!" });

    }

  } catch (err) {

    console.log(colors.red("UPDATING CHECKLIST ERROR :\n"), err);
    return res.status(400).json({ message: "Updating checklist error" });

  }

  try {

    await checklist.updateOne(data);
    return res.status(200).json({ message: "Checklist updated successfully!" });

  } catch (err) {

    console.log(colors.red("UPDATING CHECKLIST ERROR :\n"), err);
    return res.status(400).json({ message: "Updating checklist error" });

  }

};
