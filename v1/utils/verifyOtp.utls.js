const { getCacheOTP } = require("../../cache/OTP")


exports.verifyOtp=async({prefix,email})=>{
    const cacheValues = getCacheOTP({prefix,email})
    // console.log(cacheValues)
    if(!cacheValues) return null
    return cacheValues 
}