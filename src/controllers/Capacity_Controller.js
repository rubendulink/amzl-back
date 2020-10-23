import Capacity from "../models/Capacity";
import Sites from "../models/Sites";
import { validObjectId } from "../helpers/mongoose";
import { generatePDF } from "../helpers/pdf";
import moment from "moment";
import colors from "colors";

export const getCapacity = async (req, res) => {

  const { siteId } = req.params;
  const { date: queryDate } = req.query;

  if (siteId && !validObjectId(siteId)) { return res.status(400).json({ message: "Operation not valid" }); }

  const query = { };
  if (siteId) query.site = siteId;

  const date = queryDate ? moment(queryDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:59.000Z";

  query.date = { $gte: startOfDay, $lte: endOfDay };

  try {

    const capacity = await Capacity.findOne(query);
    if (!capacity) {

      return res.status(404).json({ message: "Capacity not exist or was deleted it" });

    }
    res.status(200).json({ capacity });

  } catch (err) {

    console.log(colors.red("ERROR GETTING CAPACITY"), err);
    return res.status(400).json({ message: "getting capacity error" });

  }

};

export const saveCapacity = async (req, res) => {

  if (req.body.site && !validObjectId(req.body.site)) { return res.status(400).json({ message: "Operation not valid" }); }

  const query = { site: req.body.site };

  const date = moment(req.body.date).format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:59.000Z";

  query.date = { $gte: startOfDay, $lte: endOfDay };

  try {

    let capacity = await Capacity.findOne(query);
    if (capacity) await capacity.updateOne(req.body);
    else {

      capacity = new Capacity(req.body);
      await capacity.save();

    }
    return res.status(200).json({ id: capacity._id });

  } catch (err) {

    console.log(colors.red("ERROR SAVING CAPACITY"), err);
    return res.status(400).json({ message: "save capacity error" });

  }

};

export const getGeneratePdf = async (req, res, next) => {

  try {

    const { siteId, template } = req.params;
    const { date, user } = req.query;

    const query = {};
    query.site = siteId;
    query.date = date;

    const { name } = await Sites.findById(siteId).select("name");
    const cycles = await Capacity.findOne(query).select("cycles");

    const data = { date, user, name, cycles };

    const fileBuffer = await generatePDF(data, template);

    res.setHeader("Content-Disposition", "attachment; filename=panda.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.send(fileBuffer);

  } catch (err) {

    console.log(err);
    res.status(400).json({ msg: "an error occurs" });
    next();

  }

};

export const getGenerateRegionalPdf = async (req, res, next) => {

  try {

    const { template } = req.params;
    const { user, date } = req.query;

    const data = [];

    for (const site in req.query) {

      if (site.includes("site")) {

        const siteId = req.query[site];

        const query = {};
        query.site = siteId;
        query.date = date;

        const { name } = await Sites.findById(siteId).select("name");
        const cycles = await Capacity.findOne(query).select("cycles");

        data.push({ name, user, cycles, date });

      }

    }

    const fileBuffer = await generatePDF(data, template);

    res.setHeader("Content-Disposition", "attachment; filename=panda.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.send(fileBuffer);

  } catch (err) {

    console.log(err);
    res.status(400).json({ msg: "an error occurs" });
    next();

  }

};
