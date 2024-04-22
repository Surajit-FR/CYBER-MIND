const EventModel = require('../model/event_model');
const TaskModel = require('../model/task_model');


// Add events
exports.AddEvents = async (req, res) => {
    const { event_name, location, alert, event_start_timestamp, event_end_timestamp, repeat, url, note } = req.body;

    try {
        const NewEvent = await EventModel({
            event_name,
            location,
            alert,
            event_start_timestamp,
            event_end_timestamp,
            repeat,
            url,
            note
        });

        await NewEvent.save();
        return res.status(201).json({ success: true, message: "Event added successfully!" });

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Get All event
exports.GetAllEvent = async (req, res) => {
    try {
        // Ensure type index is created for faster querying
        await EventModel.createIndexes();

        const all_event_data = await EventModel
            .find({ is_delete: false })
            .select('-__v') // Exclude sensitive fields
            .lean(); // Convert to plain JavaScript objects for performance

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: all_event_data });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Add task
exports.AddTask = async (req, res) => {
    const { task_title, task_time, location, task_assignee, task_partner, priority } = req.body;

    try {
        const Newtask = await TaskModel({
            task_title,
            task_time,
            location,
            task_assignee,
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
        // Ensure type index is created for faster querying
        await TaskModel.createIndexes();

        const all_task_data = await TaskModel
            .find({ is_delete: false })
            .select('-__v') // Exclude sensitive fields
            .lean(); // Convert to plain JavaScript objects for performance

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: all_task_data });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Complete Task
exports.CompleteTask = async (req, res) => {
    const { task_id } = req.params;
    try {
        await TaskModel.findByIdAndUpdate(
            task_id,
            {
                is_complete: true,
            },
            { new: true }
        );
        return res.status(200).json({ success: true, message: "This task now marked as completed!" });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};