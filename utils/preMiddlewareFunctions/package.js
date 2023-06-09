const dishpack = require("../../models/dishpack")
const dishpackrestaurantRel = require("../../models/dishpackrestaurantRel")
const { SetErrorResponse } = require("../../utils/responseSetter")


exports.RemoveAlldishpacksFromrestaurant=async (restaurantId) => {

    try {
      const data = await dishpackrestaurantRel.deleteMany({ restaurant: restaurantId }).lean();
      console.log("Deleted dishpacks in utils", data)
  
      if (!data) throw new SetErrorResponse();
    } catch (error) {
      throw error
    }
  };