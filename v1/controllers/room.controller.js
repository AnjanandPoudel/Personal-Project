const dishType = require("../../models/dishType.model");
const dish = require("../../models/dish.model");
const { SetErrorResponse } = require("../../utils/responseSetter");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");

//? may not need this cause it is already present in restaurant controller
exports.getdishTypes = async (req, res) => {
  try {
    const { page, limit, search, sort } = req.query;
    const dishs = await getFuzzySearchPaginatedData(
      dishType,
      {
        query: {},
        sort,
        page,
        limit,
        pagination: true,
        modFunction: (document) => {
          return document;
        },
      },
      search
    );
    if (dishs?.length < 1) throw new SetErrorResponse();

    return res.success(dishs);
  } catch (error) {
    res.fail(error);
  }
};

exports.getdishType = async (req, res) => {
  try {
    const { dishTypeId } = req.params;
    const data = await dishType.findOne({ _id: dishTypeId });
    if (!data) throw new SetErrorResponse();
    return res.success({ data });
  } catch (error) {
    res.fail(error);
  }
};

exports.postdishType = async (req, res) => {
  try {
    const { type, description, name } = req.body;
    const dish = await new dishType({
      name,
      type,
      description,
    }).save();

    if (!dish) throw new SetErrorResponse("Error Creating", 403);
    return res.success({}, "dish Created ");
  } catch (error) {
    res.fail(error);
  }
};

exports.patchdishType = async (req, res) => {
  try {
    const dishTypeId = req.params.dishTypeId;
    const { type, description, name } = req.body;

    const dish = await dishType.findByIdAndUpdate(
      { _id: dishTypeId },
      { name, type, description }
    );
    if (!dish) throw new SetErrorResponse("dish Not Found");
    return res.success({}, "dish Updated ");
  } catch (error) {
    req.file(error);
  }
};

exports.deletedishType = async (req, res) => {
  try {
    const { dishTypeId } = req.params;
    const dish = await dishType.findByIdAndDelete(dishTypeId).lean();
    if (!dish) throw new SetErrorResponse();

    return res.success({}, "dishpack Deleted ! ");
  } catch (error) {
    res.fail(error);
  }
};

//* Following code is for restaurant + dishs

exports.getrestaurantdish = async (req, res) => {
  try {
    const { restaurantId, dishId } = req.params;
    const data = await dish.find({ restaurant: restaurantId, dishId }).lean();

    if (!data) throw new SetErrorResponse();
    return res.success(data);
  } catch (error) {
    res.fail(error);
  }
};
exports.getrestaurantdishs = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const dishs = await dish.find({ restaurant: restaurantId }).lean();

    if (dishs?.length < 1) throw new SetErrorResponse("dishs Not Found");
    return res.success(dishs);
  } catch (error) {
    res.fail(error);
  }
};

exports.postrestaurantdish = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { dishTypeId, price, description, count, services } = req.body;
    
    const dish = await new dish({
      restaurant: restaurantId,
      dishType: dishTypeId,
      price,
      description,
      count,
      services,
    })
    
    dish.save()
    if (!dish) throw new SetErrorResponse("Error Creating dish",500);

    const restaurant=req?.existedDoc
    if(!restaurant) throw new SetErrorResponse("If you see this please contact us!",500)

    const dishType= req?.dishType
    if(!dishType) throw new SetErrorResponse("If you see this please contact us!",500)

    // restaurant.increasedish(count)
    // restaurant.pushdishPrice(price)
    // restaurant.pushdishType(dishTypeId)
    restaurant.addAlldishPrices(price)
    restaurant.adddishTypes(dishType.type)
    restaurant.save()



    return res.success({dish}, "dish Created !!");
  } catch (error) {
    res.fail(error);
  }
};



exports.patchrestaurantdish = async (req, res) => {
  try {
    const { restaurantId, dishId } = req.params;
    const { dishTypeId, price, description, count, services } = req.body;
    const dish = await dish.findOneAndUpdate(
      {
        dish: dishId,
        restaurant: restaurantId,
      },
      {
        dishType: dishTypeId,
        price,
        description,
        count,
        services,
      }
    ).lean();

    if (!dish) throw new SetErrorResponse("dish Not Found");
    const restaurant=req?.existedDoc
    if(!restaurant) throw new SetErrorResponse("If you see this please contact us!",500)
    const dishType= req?.dishType
    if(!dishType  ) throw new SetErrorResponse("If you see this please contact us!",500)
    
    const olddishType=dishType.findById(dish?.dishType,"type").lean()
    
    restaurant.updatedishCount(count,dish.count)
    // restaurant.updatedishPrice(price,dish.price)
    // restaurant.updatedishType(dishTypeId,dish.dishTypeId)
    restaurant.editAlldishPrices(price,dish.price)
    restaurant.editdishTypes(dishType.type,olddishType.type)
    restaurant.save()

    return res.success({}, "dish Updated !!");
  } catch (error) {
    res.fail(error);
  }
};


exports.RemovedishFromrestaurant = async (req, res) => {
  try {
    const { restaurantId, dishId } = req.params;
    const dish = await dish.findOneAndDelete({
      restaurant: restaurantId,
      dish: dishId,
    }).lean();

    if (!dish) throw new SetErrorResponse();
    const restaurant=req?.existedDoc
    if(!restaurant) throw new SetErrorResponse("If you see this please contact us!",500)
    const dishType= req?.dishType
    if(!dishType  ) throw new SetErrorResponse("If you see this please contact us!",500)


    restaurant.increasedish(dish.count)
    // restaurant.popdishPrice(dish.price)
    // restaurant.popdishType(dish.dishTypeId)
    restaurant.deleteAlldishPrices(dish.price)
    restaurant.deletedishTypes(dishType.type)
    restaurant.save()

    return res.success({}, "Deleted");
  } catch (error) {
    res.fail(error);
  }
};
