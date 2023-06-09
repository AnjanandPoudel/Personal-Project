const { getS3 } = require("../../config/digitalOceanSpace");
const multer = require("multer");
const {  spaceReducer } = require("../../utils/slugify.utls");

exports.uploadImages = ({
  secondaryPath = "homestay/hotel",
  path = "hotelpath",
  singleName = "",
  multi = false,
  fileSize = 122880,
  allowedFileTypes = ["image/jpeg", "image/jpg", "image/png","image/gif"],
}) => {
  const uploadImages = () => {
    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
      //reject file
      if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };

    const upload = multer({
      storage,
      fileFilter: fileFilter,
      limit: {
        fileSize,
      },
    }).fields([
      {
        name: "STH",
      },
    
    ]);
    return upload;
  };

  const s3upload = async (req, res, next) => {
    try {
      if (req.file) {
        const s3 = getS3();
        const renameImage =
          new Date().toISOString().replace(/:/g, "-").replace(".", "-") +
          req.file.originalname;
        const bucketName = `NAME`;
        const promisesToResolve = [
          s3
            .upload({
              Bucket: bucketName,
              Body: req.file.buffer,
              ACL: "public-read",
              Key: renameImage,
            })
            .promise(),
        ];
        const [image] = await Promise.all(promisesToResolve);
        req.file.location = image.Location;
		
      }

      if(req.files){
        let NAME=req.files?.coverImage?.length>0 ? req.files?.coverImage :null


        if(NAME){
          await UploadingImage({req,res,uploadimage:NAME,secondaryPath})
        }
     
      }
      next();
    } catch (error) {
      return res.fail(error);
    }
  };


const UploadingImage=async({req,res,uploadimage,secondaryPath})=>{
  try{
    const s3 = getS3();
    await Promise.all(
      uploadimage?.map(async (file) => {
        const renameImage =
          new Date().toISOString().replace(/:/g, "-").replace(".", "-"," ") +
          spaceReducer(file.originalname);
        
        const bucketName = `${process.env.AWS_BUCKET_NAME}${secondaryPath}`;
        const promisesToResolve = [
          s3
            .upload({
              Bucket: bucketName,
              Body: file.buffer,
              ACL: "public-read",
              Key: renameImage,
              ContentType:uploadimage[0].mimetype
            })
            .promise(),
        ];

        const [image] = await Promise.all(promisesToResolve);
        // console.log({bucketName, x :image ,renameImage })
        file.location = image.Location;
      })
    );
  }
  catch(error){
    console.log(error)
  } 
}
  return [uploadImages(), s3upload ];
};
