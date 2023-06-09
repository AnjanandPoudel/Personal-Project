const Admin = require("../../models/admin.model");
const  sTH = require("../../models/ sTH.model");
const Review = require("../../models/review.model");
const User = require("../../models/user.model");
const { SetErrorResponse } = require("../../utils/responseSetter");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");

exports.get sTHReviews = async (req, res, next) => {
  try {
    const { page, limit,sort } = req.query;
    const {  sTHId } = req.params;

    const  sTHReview=await  sTH.findById( sTHId,"averageRating noOfRating").lean()
    if(! sTHReview) throw new SetErrorResponse(" sTH Not Found",404)
    const review = await getFuzzySearchPaginatedData(Review, {
      query: {  sTH:  sTHId, approval: true },
      limit,
      page,
      sort,
      lean:true,
      pagination: true,
      populate: {path:"user",select:"firstName lastName updatedAt _id image"},
      modFunction: (document) => {
        return document;
      },
    });
    review. sTHReview= sTHReview
    res.success(review);
  } catch (error) {
    res.fail(error);
  }
};

//probably won't use
exports.getReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const review = await Review.findOne({
      _id: reviewId,
      approval: true,
    }).lean();

    res.success({ review });
  } catch (error) {
    res.fail(error);
  }
};

exports.getMyReviewIn sTH = async (req, res, next) => {
  try {
    const userId = req.locals?.user?._id;
    if(!userId) throw new SetErrorResponse("User Id not found")
    const  sTHId=req.params. sTHId;
    const review = await Review.findOne({
      user:userId,
       sTH: sTHId
    }).lean();

    res.success({ review });
  } catch (error) {
    res.fail(error);
  }
};



exports.postReviewController = async (req, res, next) => {
  try {
    const { review, rating } = req.body;
    const {  sTHId } = req.params;
    const userId = res.locals?.user?._id ;
    // const adminId = res.locals?.admin?._id;

    const  sTH = await  sTH.findById({ _id:  sTHId });
    if(! sTH) throw new SetErrorResponse(" sTH Not Found")

    const user = await Review.findOne({  sTH:  sTHId,user:userId });
    if(user) throw new SetErrorResponse("User already posted one comment in this  sTH")


    let data
    if(userId){
      const user = res.locals?.user
      data = await new Review({
        review,
        rating,
         sTH:  sTHId,
        user: user?._id,
        approval: false,
      }).save()
    }


    // else if(adminId){
      //?do nothing
      //?for future
    // }

     sTH.increment(rating)
     sTH.save()

    if(!data) throw new SetErrorResponse("Not posted",400)

    
  
    return res.success( "Review Posted ");
  } catch (error) {
    res.fail(error);
  }
};

exports.patchReviewController = async (req, res, next) => {
  try {
    const { review, rating } = req.body;
    const { reviewId, sTHId } = req.params;
    const userId = res.locals.authData._id;
   

    const  sTH = await  sTH.findById({ _id:  sTHId });
    if(! sTH) throw new SetErrorResponse(" sTH Not Found")


    const data = await Review.findOneAndUpdate(
      { user: userId,_id:reviewId },
      {
        rating,
        review,
      }
    );
     sTH.updateRating(rating,data?.rating)
     sTH.save()

    return res.success({}, "Review Updated ");
  } catch (error) {
    res.fail(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const {reviewId, sTHId} = req.params;
    const  sTH = await  sTH.findById({ _id:  sTHId });
    if(! sTH) throw new SetErrorResponse(" sTH Not Found")

    const review = await Review.deleteOne({ _id: reviewId });

    if (!review) throw new SetErrorResponse();
     sTH.decrement(review?.rating)
     sTH.save()

    return res.success({}, "Review Deleted ");
  } catch (error) {
    res.fail(error);
  }
};

//! For admins only

exports.reviewForApproval = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const reviews = await getFuzzySearchPaginatedData(Review, {
      query: { approval: false },
      limit,
      page,
      pagination: true,
      populate: "user  sTH",
      modFunction: (document) => {
        return document;
      },
    });
    res.success(reviews);
  } catch (error) {
    res.fail(error);
  }
};

exports.approveReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { approved } = req.body;
    console.log("🚀 ~ file: review.controller.js ~ line 137 ~ exports.approveReview= ~ approved", approved)
    
    if (approved === true) {
       await Review.findOneAndUpdate(
        { _id: reviewId },
        {
          approval: true,
        }
      );
    } else {
      await Review.findOneAndDelete({ _id: reviewId });
    }

    res.success({},"Done");
  } catch (error) {
    res.fail(error);
  }
};


