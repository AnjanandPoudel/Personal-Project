















//Lookupcode

// {
      //   $lookup: {
      //     from: "inquiries",
      //     let: {
      //       firstUser: "_id",
      //       secondUser: "hotel",
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
      //                 $eq: ["$hotelId", "$$secondUser"],
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
