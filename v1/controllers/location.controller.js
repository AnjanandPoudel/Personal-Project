// OTHERS ARE DELETED
exports.patchLocationController = async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const { name, coordinates, type, description } = req.body;
    const coverImage =
      req.files?.coverImage?.length > 0
        ? req.files.coverImage[0]?.location
        : undefined;

    const editQuery = {
      name,
      type: type || "Point",
      coordinates,
      description,
    };

    if (coverImage) {
      editQuery.coverImage = coverImage;
    }

    const location = await Location.findByIdAndUpdate(
      { _id: locationId },
      {
        ...editQuery,
      }
    );

    if (coverImage && location?.coverImage) {
      deleteFile(location?.coverImage);
    }

    return res.success({}, "Location Updated ");
  } catch (error) {
    res.fail(error);
  }
};

