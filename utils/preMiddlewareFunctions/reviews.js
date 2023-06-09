const Review = require("../../models/review.model");



exports.RemoveAllReviewsFromrestaurant=async (restaurantId) => {
   
    try {
      const review = await Review.deleteMany({ restaurant: restaurantId }).lean();
      console.log("Deleted Reviews in utils", review)

      if (!review) throw new SetErrorResponse();
    } catch (error) {
      throw error
    }
  };