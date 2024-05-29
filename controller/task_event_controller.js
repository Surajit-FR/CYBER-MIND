const EventModel = require('../model/event_model');
const FamilyModel = require('../model/family_model');
const MemberModel = require('../model/member_model');
const TaskModel = require('../model/task_model');


// Add events
exports.AddEvents = async (req, res) => {
    const { event_name, location, alert, event_start_timestamp, event_end_timestamp, is_allDay, repeat, url, note } = req.body;

    try {
        // Retrieve data from token recieved.
        const decoded_token = req.decoded_token;

        // Fetch family based on who added the event.
        const FAMILY = await FamilyModel.findOne({ family_hash_id: decoded_token.family });
        const family_id = FAMILY?._id;

        const NewEvent = await EventModel({
            family: family_id,
            event_name,
            location,
            alert,
            event_start_timestamp,
            event_end_timestamp,
            is_allDay,
            repeat,
            url,
            note
        });

        const SavedEvent = await NewEvent.save();
        return res.status(201).json({ success: true, message: "Event added successfully!", data: SavedEvent });

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Get All event
exports.GetAllEvent = async (req, res) => {
    try {
        // Retrieve data from token recieved.
        const decoded_token = req.decoded_token;

        // Fetch family based on who added the event.
        const FAMILY = await FamilyModel.findOne({ family_hash_id: decoded_token.family });
        const family_id = FAMILY?._id;

        // Ensure type index is created for faster querying
        await EventModel.createIndexes();

        const all_event_data = await EventModel
            .find({ is_delete: false, family: family_id })
            .populate({
                path: 'family',
                select: '-createdAt -updatedAt -__v' // Exclude fields from family population
            })
            .select('-createdAt -updatedAt -__v') // Exclude sensitive fields
            .lean(); // Convert to plain JavaScript objects for performance

        return res.status(200).json({ success: true, message: all_event_data?.length > 0 ? "Data fetched successfully!" : "No data found!", data: all_event_data });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Add task
exports.AddTask = async (req, res) => {
    const { task_title, task_time, location, task_partner, priority } = req.body;

    try {
        // Retrieve data from token recieved.
        const decoded_token = req.decoded_token;

        // Fetch family based on who added the event.
        const FAMILY = await FamilyModel.findOne({ family_hash_id: decoded_token.family });
        const family_id = FAMILY?._id;

        const Newtask = await TaskModel({
            family: family_id,
            task_title,
            task_time,
            location,
            task_assignee: decoded_token._id,
            task_partner,
            priority,
        });

        await Newtask.save();
        return res.status(201).json({ success: true, message: "Task added successfully!" });

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Get All task
exports.GetAllTask = async (req, res) => {
    try {
        // Retrieve data from token recieved.
        const decoded_token = req.decoded_token;

        // Fetch family based on who added the event.
        const FAMILY = await FamilyModel.findOne({ family_hash_id: decoded_token.family });
        const family_id = FAMILY?._id;

        if (!family_id) {
            return res.status(400).json({ success: false, message: "Family is missing." });
        }
        // Ensure type index is created for faster querying
        await TaskModel.createIndexes();

        const all_task_data = await TaskModel
            .find({ is_delete: false, family: family_id })
            .populate({
                path: 'task_assignee',
                select: '-password -createdAt -updatedAt -__v'
            })
            .populate({
                path: 'task_partner',
                select: '-password -createdAt -updatedAt -__v'
            })
            .select('-createdAt -updatedAt -__v')
            .lean(); // Convert to plain JavaScript objects for performance

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: all_task_data });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// Complete Task
exports.CompleteTask = async (req, res) => {
    const { task_id } = req.params;
    try {
        // Find the task by its ID
        const task = await TaskModel.findById(task_id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        // Toggle the is_complete value
        const newStatus = !task.is_complete;
        await TaskModel.findByIdAndUpdate(
            task_id,
            {
                is_complete: newStatus,
            },
            { new: true }
        );
        return res.status(200).json({ success: true, message: newStatus ? "This task now marked as Complete!" : "This task now marked as Incomplete!" });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Delete Task
exports.DeleteTask = async (req, res) => {
    const { task_id } = req.params;
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(task_id);

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        return res.status(200).json({ success: true, message: "This task has been deleted!" });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};