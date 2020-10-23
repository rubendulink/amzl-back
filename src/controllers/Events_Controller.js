import Events from "../models/Events";
import colors from "colors";
import { validObjectId } from "../helpers/mongoose";

/**
 * Get all Events
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getEvents = async (req, res) => {

  const { siteId, startDate } = req.query;

  if (siteId && !validObjectId(siteId)) {

    return res.status(400).json({ message: "Operation not valid" });

  }

  const date = startDate ? new Date(startDate) : new Date();
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const query = { startDate: { $gte: startOfDay } };
  if (siteId) query.site = siteId;

  try {

    const events = await Events.find(query);
    return res.status(200).json({ events });

  } catch (err) {

    console.log(colors.red("ERROR GETTING EVENTS"), err);
    return res.status(400).json({ message: "Error getting events" });

  }

};

/**
 * Create Event
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createEvent = async (req, res) => {

  try {

    const event = new Events(req.body);
    await event.save();

    return res.status(200).json({ id: event._id });

  } catch (err) {

    console.log(colors.red("ERROR CREATING EVENT :\n"), err);
    return res.status(500).json({ message: "Error creating event" });

  }

};

/**
 * Delete Event
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const deleteEvent = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let event;

  try {

    event = await Events.findById(id);
    if (!event) return res.status(400).json({ message: "Event does not exist or was deleted" });

  } catch (err) {

    console.log(colors.red("ERROR GETTING EVENT \n"), err);
    return res.status(500).json({ message: "Error getting event" });

  }

  try {

    await event.remove();
    return res.status(200).json({ message: "Event deleted" });

  } catch (err) {

    console.log(colors.red("ERROR DELETING EVENT :\n"), err);
    return res.status(500).json({ message: "Error deleting event" });

  }

};
