

exports.customCreateSecretKey=(randomValues="")=>{
    try {
        return process.env.SECRETKEY+randomValues

    } catch (error) {
        console.log(error)
    }
}