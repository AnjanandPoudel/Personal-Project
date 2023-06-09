
var SibApiV3Sdk = require("sib-api-v3-sdk");


exports.emailInitialSetup=()=>{
  var defaultClient = SibApiV3Sdk.ApiClient.instance;
  // Configure API key authorization: api-key
  var apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.Sth;
}

  exports.sendEmailToEmailAddress=async(emailData) =>{
    try{  
        const {email,otp,subject,userType}=emailData;
        const superAdminEmail='@gmail.com'
        const toEmail= ( userType==="user") ? email : superAdminEmail
        
        // console.log({emailData})
        // console.log(process.env.SENDEREMAIL)
        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
        sendSmtpEmail = {
          // 
          sender: { email: process.env.SENDEREMAIL }, 
          to: [
            {
              email: toEmail
            },
          ],
          subject: `${subject}`,
          textContent: `
          <div>
         
          </div>
          `,
        };

        const sendingEmailProcess = await apiInstance.sendTransacEmail(sendSmtpEmail)
        // console.log({sendingEmailProcess})
        if(!sendingEmailProcess) return false
        return true
    }
    catch (error){
        console.log(error)
    }
  }