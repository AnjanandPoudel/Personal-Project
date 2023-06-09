const fs = require("fs");

exports.changeResponse = () => {
  fs.readFile(
    "./helpers/swagger/swagger_output.json",
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      try {
        let data = JSON.parse(jsonString);

        Object.values(data.paths).forEach((item) => {
          const x = Object.values(item);
          x.map((item) => {
            item.responses = {
              200: {
                description: "descp",
              },
            };
          });
        });
        //  arr=Object.values(arr)
        // console.log( "Data is:", JSON.stringify(data) ); // => "Customer address is: Infinity Loop Drive"

        fs.writeFile(
          "./helpers/swagger/swagger_output.json",
          JSON.stringify(data),
          (err) => {
            if (err) console.log("Error writing file:", err);
          }
        );
      } catch (err) {
        console.log("Error parsing JSON string:", err);
      }
    }
  );
};
