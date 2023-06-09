const { check, query, validationResult } = require("express-validator");
const { isJsonParsable, isFloatParseble } = require("../../utils/isParsable");
const {
  PARKING_OPTIONS,
  dishTYPE,
  dish_SERVICES,
} = require("../../utils/constants");

exports.validateArray = (params) => {
  try {
    let result = [];
    params.forEach((param) => {
      switch (param) {
        case "services":
          result.push(
            check("services", "services not Valid")
              .isArray()
              .custom((data) => {
                let bool = true;
                data.forEach((item) => {
                  if (!Object.values(dish_SERVICES).includes(item)) {
                    bool = false;
                  }
                });

                return bool;
              })
          );
          break;

        case "relatedImageUrl":
          result.push(
            check("relatedImageUrl", "relatedImageUrl must be array")
              .custom((data) => isJsonParsable(data))
              .withMessage("Not Json parsable")
              .customSanitizer((data) => {
                if (isJsonParsable(data)) {
                  data = JSON?.parse(data);
                }
                console.log({ data });
                return data;
              })
              .isArray()
          );
          break;
        case "dishs":
          result.push(
            check("dishs", "dishs must be array")
              .custom((data) => isJsonParsable(data))
              .withMessage("Not Json parsable")
              .customSanitizer((data) => {
                if (isJsonParsable(data)) {
                  data = JSON?.parse(data);
                }

                return data;
              })
              .isArray(),

            check("dishs.*.dishTypeId", "dishTypeId should be mongoId")
              .notEmpty()
              .isMongoId(),

            check("dishs.*.price", "price should be ")
              .isNumeric()
              .isFloat({ min: 0 })
              .toFloat()
              .customSanitizer((data) => {
                data = data.toFixed(5);
                return data;
              }),
            check("dishs.*.description", "description not Valid")
              .optional()
              .isLength({ min: 3, max: 500 })
              .isString(),

            check("dishs.*.count", "count not Valid")
              .optional()
              .toInt()
              .isInt(),

            check("dishs.*.services", "services not Valid")
              .isArray()
              .custom((data) => {
                let bool = true;
                data.forEach((item) => {
                  if (!Object.values(dish_SERVICES).includes(item)) {
                    bool = false;
                  }
                });

                return bool;
              })
          );
          break;

      }
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.getMethodValidate = () => {
  try {
    let result = [];
    let params = ["page", "search", "limit", "sort", "type"];
    params.forEach((param) => {
      switch (param) {
        case "sort":
          result.push(
            query(
              "sort",
              "sort not valid"
            )
              .optional()
              .isString()
              .isLength({ min: 3, max: 30 })
          );
          break;

        case "search":
          result.push(
            query(
              "search",
              "search must more than 1 character and less than 50 character"
            )
              .optional()
              .isString()
              .isLength({ min: 1, max: 50 })
          );
          break;

        case "limit":
          result.push(
            query("limit", "limit must be positive number")
              .optional()
              .customSanitizer((data) => data || 1)
              .isInt({ gt: 0 })
              .toInt()
          );
          break;

        case "page":
          result.push(
            query("page", "Page must be positive number")
              .optional()
              .customSanitizer((data) => data || 0)
              .isInt({ gt: -1 })
              .toInt()
          );
          break;

        case "type":
          result.push(
            check("type", "type is Invalid (Enum) ")
              .optional()
              .isLength({ min: 3, max: 20 })
              .isString()
              .custom((data) => Object.values(dishTYPE).includes(data))
          );
          break;

        case "parking":
          result.push(
            check("parking", "Parking value is not valid !! ")
              .optional()
              .isString()
              .custom((data) => {
                return Object.values(PARKING_OPTIONS).includes(data);
              })
          );
          break;
      }
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.validateOpt = (params) => {
  try {
    let result = [];
    params.forEach((param) => {
      switch (param) {
        case "search":
          result.push(
            query(
              "search",
              "search must more than 3 character and less than 50 character"
            )
              .optional()
              .isLength({ min: 3, max: 50 })
          );
          break;

        case "limit":
          result.push(
            query("limit", "limit must be positive number")
              .customSanitizer((data) => data || 1)
              .isInt({ gt: 0 })
              .toInt()
          );
          break;

        case "page":
          result.push(
            query("page", "Page must be positive number")
              .customSanitizer((data) => data || 0)
              .isInt({ gt: -1 })
              .toInt()
          );
          break;

        case "email":
          result.push(
            check(
              "email",
              "Email should be between 5 to 50 characters and proper Email"
            )
              .optional()
              .isLength({ min: 5, max: 50 })
              .isEmail()
              .normalizeEmail()
          );
          break;

        case "password":
          result.push(
            check(
              "password",
              "password should be more than 8 character but less than 30 char"
            )
              .optional()
              .isString()
              .withMessage("Password should be in string form")
              .isLength({ min: 8, max: 30 })
          );
          break;

        case "name":
          result.push(
            check(
              "name",
              "Name should be between 5 to 50 characters and it should be string"
            )
              .isLength({ min: 5, max: 50 })
              .isString()
              .optional()
          );
          break;

        case "description":
          result.push(
            check("description", "description is Invalid ")
              .optional()
              .isLength({ min: 3, max: 500 })
              .isString()
          );
          break;

        case "price":
          result.push(
            check("price", "Price is Invalid ")
              .optional()
              .isNumeric()
              .isFloat({ min: 0 })
              .toFloat()
              .customSanitizer((data) => {
                data = data.toFixed(5);
                return data;
              })
          );
          break;

        case "type":
          result.push(
            check("type", "type is Invalid (Enum) ")
              .optional()
              .isLength({ min: 3, max: 20 })
              .isString()
              .custom((data) => Object.values(dishTYPE).includes(data))
          );
          break;

        case "address":
          result.push(
            check(
              "address",
              "Address should be between 5 to 50 characters and it should be string"
            )
              .isLength({ min: 5, max: 50 })
              .isString()
              .optional()
          );
          break;

        case "phoneNumber":
          result.push(
            check(
              "phoneNumber",
              "PhoneNumber should be between 7 to 15 characters"
            )
              .optional()
              .isLength({ min: 7, max: 15 })
              .isMobilePhone("ne-NP")
          );
          break;

        case "startedAt":
          result.push(
            check(
              "startedAt",
              "startedAt should be between 1 to 40 characters long and must Date representing value ]"
            )
              .optional()
              .isLength({ min: 1, max: 40 })
              .isISO8601()
              .toDate()
          );
          break;
        // .matches('/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/)
        // if the isISO8601 did not work try using regex ...
        case "endsAt":
          result.push(
            check(
              "endsAt",
              "endsAt should be between 1 to 40 characters long and must be a Date representing value "
            )
              .optional()
              .isLength({ min: 1, max: 40 })
              .isISO8601()
              .toDate()
          );
          break;

        case "rememberMe":
          result.push(
            check("rememberMe")
              .optional()
              .isBoolean()
              .toBoolean()
              .withMessage("Should be Boolean")
          );
          break;

        case "rating":
          result.push(
            check("rating", "rating is not valid, should be between 1 to 5")
              .optional()
              .isNumeric()
              .toInt()
              .isInt({ gt: 0, lt: 6 })
          );
          break;
        case "review":
          result.push(
            check(
              "review",
              "review is not valid, should be between 1 to 200 character"
            )
              .optional()
              .isLength({ min: 2, max: 200 })
          );

          break;
        case "remarks":
          result.push(
            check(
              "remarks",
              "remarks is not valid, should be between 1 to 250 character"
            )
              .optional()
              .isLength({ min: 2, max: 250 })
          );
          break;

        case "firstName":
          result.push(
            check(
              "firstName",
              "First Name should be between 3 to 50 characters, it is required and should be string"
            )
              .optional()
              .isLength({ min: 3, max: 50 })
              .isString()
          );
          break;
        case "lastName":
          result.push(
            check(
              "lastName",
              "Last Name should be between 3 to 50 characters, it is required and should be string"
            )
              .optional()
              .isLength({ min: 3, max: 50 })
              .isString()
          );
          break;
        case "secondaryPhoneNumber":
          result.push(
            check("secondaryPhoneNumber", "Phone number Not valid")
              .optional()
              .isLength({ min: 7, max: 15 })
              .isMobilePhone("ne-NP")
          );
          break;

        case "checkInTime":
          result.push(
            check("checkInTime", "checkInTime must in String")
              .optional()
              .isLength({ min: 1, max: 20 })
              .isString()
          );
          break;

        case "checkOutTime":
          result.push(
            check("checkOutTime", "checkOutTime must in String")
              .optional()
              .isLength({ min: 1, max: 20 })
              .isString()
          );
          break;

        case "latitude":
          result.push(
            check("latitude", "latitude must be float value")
              .optional()
              .customSanitizer((data) => {
                if (isFloatParseble(data)) {
                  parseFloat(data);
                }
                return data;
              })
              .isNumeric()
              .isFloat({ min: 0 })
              .toFloat()
              .customSanitizer((data) => {
                data = data.toFixed(5);
                return data;
              })
          );
          break;
        case "longitude":
          result.push(
            check("longitude", "longitude must be float value")
              .optional()
              .customSanitizer((data) => {
                if (isFloatParseble(data)) {
                  parseFloat(data);
                }
                return data;
              })
              .isNumeric()
              .isFloat({ min: 0 })
              .toFloat()
              .customSanitizer((data) => {
                data = data.toFixed(5);
                return data;
              })
          );
          break;

          case "dishTypeId":
          result.push(
            check("dishTypeId", "dishTypeId should be MongoId")
              .optional()
              .isMongoId()
          );
          break;

          case "locationId":
            result.push(
              check("locationId", "locationId which is mongoId, is not Valid")
                .optional()
                .isMongoId()
            );
            break;

            case "coordinates":
          result.push(
            check("coordinates", "coordinates must be array")
              .optional()
              .customSanitizer((data) => {
                if (typeof data === "string") {
                  if (data[0] == "[" && data[data?.length - 1] == "]") {
                    data = JSON.parse(data);
                  }
                }
                return data;
              })
              .isArray()

          );
          break;
  
      }
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};//validateOptEnds here

exports.validate = (params) => {
  try {
    let result = [];
    params.forEach((param) => {
      switch (param) {
        case "search":
          result.push(
            query(
              "search",
              "search must more than 1 character and less than 50 character"
            )
              .optional()
              .isLength({ min: 1, max: 50 })
          );
          break;

        case "limit":
          result.push(
            query("limit", "limit must be positive number")
              .customSanitizer((data) => data || 1)
              .isInt({ gt: 0 })
              .toInt()
          );
          break;

        case "page":
          result.push(
            query("page", "Page must be positive number")
              .customSanitizer((data) => data || 0)
              .isInt({ gt: -1 })
              .toInt()
          );
          break;

        case "email":
          result.push(
            check(
              "email",
              "Email should be between 5 to 50 characters and proper Email"
            )
              .notEmpty()
              .isLength({ min: 5, max: 50 })
              .isEmail()
              .normalizeEmail()
          );
          break;

        case "password":
          result.push(
            check(
              "password",
              "password should be more than 8 character but less than 30 char"
            )
              .notEmpty()
              .isString()
              .withMessage("Password should be in string form")
              .isLength({ min: 8, max: 30 })
          );
          break;

        case "firstName":
          result.push(
            check(
              "firstName",
              "First Name should be between 3 to 50 characters, it is required and should be string"
            )
              .notEmpty()
              .isLength({ min: 3, max: 50 })
              .isString()
          );
          break;

        case "lastName":
          result.push(
            check(
              "lastName",
              "Last Name should be between 3 to 50 characters, it is required and should be string"
            )
              .notEmpty()
              .isLength({ min: 3, max: 50 })
              .isString()
          );
          break;

        case "name":
          result.push(
            check(
              "name",
              "Name should be between 2 to 50 characters and it should be string"
            )
              .notEmpty()
              .isLength({ min: 2, max: 50 })
              .isString()
          );
          break;

        case "address":
          result.push(
            check(
              "address",
              "Address should be between 5 to 50 characters and it should be string"
            )
              .isLength({ min: 5, max: 50 })
              .isString()
              .optional()
          );
          break;

        case "phoneNumber":
          result.push(
            check("phoneNumber", "PhoneNumber not Valid, (Mobile phone number)")
              .optional()
              .isLength({ min: 7, max: 15 })
              .isMobilePhone("ne-NP")
          );
          break;

        case "startedAt":
          result.push(
            check(
              "startedAt",
              "startedAt should be between 1 to 40 characters long and must Date representing value ]"
            )
              .optional()
              .isLength({ min: 1, max: 40 })
              .isISO8601()
              .toDate()
          );
          break;

        case "endsAt":
          result.push(
            check(
              "endsAt",
              "endsAt should be between 1 to 40 characters long and must be a Date representing value "
            )
              .optional()
              .isLength({ min: 1, max: 40 })
              .isISO8601()
              .toDate()
          );
          break;

        case "OTP":
          result.push(
            check("OTP", "OTP must be of 4 digits")
              .notEmpty()
              .isLength({ min: 4, max: 4 })
              .isString()
              .withMessage("OTP should be string value ")
          );
          break;

        case "type":
          result.push(
            check("type", "type is Invalid (Enum) ")
              .notEmpty()
              .isLength({ min: 3, max: 20 })
              .isString()
              .custom((data) => Object.values(dishTYPE).includes(data))
          );
          break;

        case "description":
          result.push(
            check("description", "description is Invalid ")
              .optional()
              .isLength({ min: 3, max: 500 })
              .isString()
          );
          break;

        case "price":
          result.push(
            check("price", "Price is Invalid ")
              .notEmpty()
              .isNumeric()
              .isFloat({ min: 0 })
              .toFloat()
              .customSanitizer((data) => {
                data = data.toFixed(5);
                return data;
              })
          );
          break;

        case "rememberMe":
          result.push(
            check("rememberMe")
              .optional()
              .isBoolean()
              .toBoolean()
              .withMessage("Should be Boolean")
          );
          break;

        case "userId":
          result.push(
            check("userId", "userId should be a mongoId and not Empty")
              .notEmpty()
              .isLength({ min: 5, max: 50 })
              .isMongoId()
          );
          break;

        case "adminId":
          result.push(check("adminId", "Not valid").notEmpty().isMongoId());
          break;

        case "rating":
          result.push(
            check("rating", "rating is not valid, should be between 1 to 5")
              .optional()
              .isNumeric()
              .toInt()
              .isInt({ gt: 0, lt: 6 })
          );
          break;

        case "review":
          result.push(
            check(
              "review",
              "review is not valid, should be between 1 to 250 character"
            )
              .optional()
              .isLength({ min: 2, max: 250 })
          );

          break;
        case "remarks":
          result.push(
            check(
              "remarks",
              "remarks is not valid, should be between 1 to 250 character"
            )
              .optional()
              .isLength({ min: 2, max: 250 })
          );
          break;

        /////////////////////////////////////
        //**Custom validators  */

        case "coordinates":
          result.push(
            check("coordinates", "coordinates must be array")
              .notEmpty()
              .customSanitizer((data) => {
                if (typeof data === "string") {
                  if (data[0] == "[" && data[data?.length - 1] == "]") {
                    data = JSON.parse(data);
                  }
                }
                return data;
              })
              .isArray()
          );
          break;

        case "longitude":
          result.push(
            check("longitude", "longitude must be float value")
              .notEmpty()
              .customSanitizer((data) => {
                if (isFloatParseble(data)) {
                  parseFloat(data);
                }
                return data;
              })
              .isNumeric()
              .isFloat({ min: 0 })
              .toFloat()
              .customSanitizer((data) => {
                data = data.toFixed(5);
                return data;
              })
          );
          break;

        case "restaurantId":
          result.push(
            check("restaurantId", "restaurantId should be a mongoId and not Empty")
              .notEmpty()
              .isLength({ min: 5, max: 50 })
              .isMongoId()
          );
          break;

        case "dishId":
          result.push(
            check("dishId", "dishId should be MongoId")
              .notEmpty()
              .isMongoId()
          );
          break;

        case "dishTypeId":
          result.push(
            check("dishTypeId", "dishTypeId should be MongoId")
              .notEmpty()
              .isMongoId()
          );
          break;

        case "parking":
          result.push(
            check("parking", "Parking value is not valid !! ")
              .notEmpty()
              .isString()
              .custom((data) => {
                return Object.values(PARKING_OPTIONS).includes(data);
              })
          );
          break;

        case "noOfdishs":
          result.push(
            check("noOfdishs", "noOfdishs is not Valid")
              .optional()
              .toInt()
              .isInt({ gt: 0, lt: 500 })
          );
          break;

        case "locationId":
          result.push(
            check("locationId", "locationId which is mongoId, is not Valid")
              .notEmpty()
              .isMongoId()
          );
          break;

        case "checkInTime":
          result.push(
            check("checkInTime", "checkInTime must in String ")
              .optional()
              .isLength({ min: 1, max: 20 })
              .isString()
          );
          break;

        case "checkOutTime":
          result.push(
            check("checkOutTime", "checkOutTime must in String")
              .optional()
              .isLength({ min: 1, max: 20 })
              .isString()
          );
          break;
        // .matches('/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/)
        // if the isISO8601 did not work try using regex ...
       
  
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    // errorHandler({ res, error, message: "Validation Related Errors" });
  }
};
