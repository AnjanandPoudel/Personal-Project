

const NodeCache = require("node-cache");
const myCache = new NodeCache();
// const prefix="myOTP"

exports.setCacheOTP = ({prefix,email,savingValues}) => {
    try{
        const key = `${prefix}_${email}`
        const success = myCache.set(key, savingValues, 1_000_000);
        return success
    }
    catch(error){
        console.log(error)
    }

}

exports.getCacheOTP = ({prefix,email}) => {
   try {
    const key = `${prefix}_${email}`
    const value = myCache.get(key);
    return value
   } catch (error) {
    console.log(error)
   }
    
}






