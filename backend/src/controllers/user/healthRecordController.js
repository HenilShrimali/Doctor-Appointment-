import HEALTHRECORD from "../../models/userHealthRecordModel.js";
import cloudinary from "../../utils/cloudinary.js";

export const uploadHealthRecordsController = async (req, res) => {
  try {
    const { title, files } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one file is required",
      });
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.data, {
        folder: "health-records",
        resource_type: "auto",
      }),
    );

    const uploadResults = await Promise.all(uploadPromises);

    const uploadedFiles = uploadResults.map((result, index) => ({
      fileName: files[index].name,
      fileUrl: result.secure_url,
      fileType: files[index].type,
      fileSize: files[index].size,
      publicId: result.public_id,
    }));

    const healthRecord = await HEALTHRECORD.create({
      userId: req.user._id,
      title: title.trim(),
      files: uploadedFiles,
    });

    const populatedRecord = await HEALTHRECORD.findById(
      healthRecord._id,
    ).populate("userId", "name email");

    res.status(201).json({
      success: true,
      message: "Health records uploaded successfully",
      data: populatedRecord,
    });
  } catch (error) {
    console.error("Upload health records error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload health records",
      error: error.message,
    });
  }
};

export const getUserHealthRecordsController = async (req, res) => {
  try {
    const { search, sortBy = "createdAt", order = "desc" } = req.query;

    let query = { userId: req.user._id };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const records = await HEALTHRECORD.find(query)
      .sort(sortOptions)
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Get health records error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch health records",
      error: error.message,
    });
  }
};

export const getHealthRecordByIdController = async (req, res) => {
  try {
    const record = await HEALTHRECORD.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("userId", "name email");

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Health record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Get health record error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch health record",
      error: error.message,
    });
  }
};

export const updateHealthRecordController = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const record = await HEALTHRECORD.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Health record not found",
      });
    }

    record.title = title.trim();
    await record.save();

    const updatedRecord = await HEALTHRECORD.findById(record._id).populate(
      "userId",
      "name email",
    );

    res.status(200).json({
      success: true,
      message: "Health record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Update health record error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update health record",
      error: error.message,
    });
  }
};

export const deleteFileFromRecordController = async (req, res) => {
  try {
    const { recordId, fileId } = req.params;

    const record = await HEALTHRECORD.findOne({
      _id: recordId,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Health record not found",
      });
    }

    const fileIndex = record.files.findIndex(
      (file) => file._id.toString() === fileId,
    );

    if (fileIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const file = record.files[fileIndex];

    try {
      if (file.publicId) {
        await cloudinary.uploader.destroy(file.publicId);
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
    }

    record.files.splice(fileIndex, 1);

    if (record.files.length === 0) {
      await record.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Last file deleted, record removed",
        recordDeleted: true,
      });
    }

    await record.save();

    const updatedRecord = await HEALTHRECORD.findById(record._id).populate(
      "userId",
      "name email",
    );

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message,
    });
  }
};

export const deleteHealthRecordController = async (req, res) => {
  try {
    const record = await HEALTHRECORD.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Health record not found",
      });
    }

    const deletePromises = record.files.map((file) => {
      if (file.publicId) {
        return cloudinary.uploader.destroy(file.publicId);
      }
      return Promise.resolve();
    });

    try {
      await Promise.all(deletePromises);
    } catch (cloudinaryError) {
      console.error("Cloudinary bulk deletion error:", cloudinaryError);
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: "Health record deleted successfully",
    });
  } catch (error) {
    console.error("Delete health record error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete health record",
      error: error.message,
    });
  }
};

export const addFilesToRecordController = async (req, res) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one file is required",
      });
    }

    const record = await HEALTHRECORD.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Health record not found",
      });
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.data, {
        folder: "health-records",
        resource_type: "auto",
      }),
    );

    const uploadResults = await Promise.all(uploadPromises);

    const uploadedFiles = uploadResults.map((result, index) => ({
      fileName: files[index].name,
      fileUrl: result.secure_url,
      fileType: files[index].type,
      fileSize: files[index].size,
      publicId: result.public_id,
    }));

    record.files.push(...uploadedFiles);
    await record.save();

    const updatedRecord = await HEALTHRECORD.findById(record._id).populate(
      "userId",
      "name email",
    );

    res.status(200).json({
      success: true,
      message: "Files added successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Add files error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add files",
      error: error.message,
    });
  }
};
