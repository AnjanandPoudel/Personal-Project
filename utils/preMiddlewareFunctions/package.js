const Package = require("../../models/package")
const PackageHotelRel = require("../../models/packageHotelRel")
const { SetErrorResponse } = require("../../utils/responseSetter")


exports.RemoveAllPackagesFromHotel=async (hotelId) => {

    try {
      const data = await PackageHotelRel.deleteMany({ hotel: hotelId }).lean();
      console.log("Deleted Packages in utils", data)
  
      if (!data) throw new SetErrorResponse();
    } catch (error) {
      throw error
    }
  };