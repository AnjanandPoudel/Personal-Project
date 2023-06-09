const Review = require("../../models/review.model");



exports.RemoveAllReviewsFromHotel=async (hotelId) => {
   
    try {
      const review = await Review.deleteMany({ hotel: hotelId }).lean();
      console.log("Deleted Reviews in utils", review)

      if (!review) throw new SetErrorResponse();
    } catch (error) {
      throw error
    }
  };