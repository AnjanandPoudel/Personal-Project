const { setError, SetErrorResponse } = require("../../utils/responseSetter");

// exports.duplicateValueChecker = async ({ res, value, model, next }) => {
//   try {
//     const valueChecked = await model.findOne(value);
//     if (valueChecked) {
//       throw setError({ error: `${value} not found`, status: 404 });
//     }
//     return;
//   } catch (err) {
//     return res.fail(err);
//   }
// };

exports.checkDuplicateValue = (model, queries) => {
  const returnFunc = async (req, res, next) => {
    try {
      const getQuery = () => {
        const returningData = {};
        queries.forEach((query) => {
          const { key, value } = query;
          const values = value.split(".");
          returningData[key] = values.reduce((_req, _value) => {
            return _req[_value]; //req.body.email
          }, req);
        });
        return returningData
      };
      const valueToCheck=getQuery()
      const valueChecked = await model.findOne(valueToCheck);
      if (valueChecked) {
        throw new SetErrorResponse(`${[Object.keys(valueToCheck)]} already exist`,403)
      }
      next();
    } catch (err) {
      return res.fail(err);
    }

  };
  return [returnFunc];
};
