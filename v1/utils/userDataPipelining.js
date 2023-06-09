exports.userDataPipelining=(userData)=>{
    const {_id,email,phoneNumber,firstName,lastName,address,randomValues}=userData
    return{
        _id,email,phoneNumber,firstName,lastName,address,randomValues
    }
}