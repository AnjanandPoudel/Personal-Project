















//Lookupcode

// {
      //   $lookup: {
      //     from: "inquiries",
      //     let: {
      //       firstUser: "_id",
      //       secondUser: "restaurant",
      //     },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               {
      //                 $eq: ["$_id", "$$firstUser"],
      //               },
      //               {
      //                 $eq: ["$restaurantId", "$$secondUser"],
      //               },
      //             ],
      //           },
      //         },
      //       },
      //     ],
      //     as: "Inquiry_doc",
      //   },
      // },
      // {
      //   $replaceRoot: {
      //     newRoot: {
      //       $mergeObjects: [
      //         {
      //           $arrayElemAt: ["$result", 0],
      //         },
      //         {
      //           email: "$$ROOT._id",
      //           inquiry:"$result"
      //         },
      //       ],
      //     },
      //   },
      // },
