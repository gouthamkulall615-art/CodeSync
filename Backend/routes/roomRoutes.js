import express from "express";
import Room from "../models/Room.js";
import User from "../models/user.js";

import { protect } from "../middlewares/authMiddleware.js"; 

const router = express.Router();


router.post("/create", protect, async (req, res) => {
  try {
    let pin;
    let isUnique = false;
    while (!isUnique) {
      pin = Math.floor(100000 + Math.random() * 900000).toString();
      const existingRoom = await Room.findOne({ pin });
      if (!existingRoom) isUnique = true;
    }

   
    const newRoom = new Room({
      pin,
      host: req.user._id,
      allowedUsers: [req.user._id], 
    });

    await newRoom.save();

   
    await User.findByIdAndUpdate(req.user._id, {
      $push: { hostedRooms: newRoom._id }
    });

    res.status(201).json({ success: true, pin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create room" });
  }
});

// 2. PEER: Verify access to a room
router.post("/verify", protect, async (req, res) => {
  try {
    const { pin } = req.body;
    const room = await Room.findOne({ pin });

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found or invalid PIN" });
    }

    if (!room.isActive) {
      return res.status(403).json({ success: false, message: "This session has been closed" });
    }

    
    if (!room.allowedUsers.includes(req.user._id)) {
      room.allowedUsers.push(req.user._id);
      await room.save();
      
      await User.findByIdAndUpdate(req.user._id, {
        $push: { accessibleRooms: room._id }
      });
    }

    res.status(200).json({ success: true, message: "Access granted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

export default router;