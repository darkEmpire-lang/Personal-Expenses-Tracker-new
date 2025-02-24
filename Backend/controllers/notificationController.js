import Notification from "../models/notificationModel.js";


 const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
  }
};


 const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Notification deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting notification", error: error.message });
  }
};

 const getAllNotifications = async (req, res) => {
    try {
      const notificationDetails = await Notification.find().populate("userId", "name email");; 
      res.json({ success: true, notificationDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error fetching users" });
    }
  };

   const getNotificationById = async (req, res) => {
    try {
    const notification=  await Notification.findById(req.params.id);
      res.status(200).json({ success: true, message: "Notification  successfully fetched !",notification });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error getting notification", error: error.message });
    }
  };

  export {getUserNotifications,deleteNotification,getAllNotifications,getNotificationById}