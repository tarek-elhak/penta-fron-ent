import { app } from "./init";

import { getAuth , RecaptchaVerifier , signInWithPhoneNumber } from "firebase/auth";
const auth = getAuth(app);
auth.useDeviceLanguage();


$("#get__code").on("click", function(){
   // check the input field
   const inputField =$("#phone__number").val();
   if ( inputField === '' || isNaN(inputField)){
      $("#phone__number__missing").text("phone number is required");
   }else{
      $("#phone__number__missing").text("");
      window.recaptchaVerifier = new RecaptchaVerifier("recaptcha", {
         "size": "normal",
         "callback": () => {
            sendVerificationCode();
         }
      } , auth);

      recaptchaVerifier.render().then(widgetId => {
         window.recaptchaWidgetId = widgetId;
      })
   }

});

function sendVerificationCode()
{
   const phoneNumber = $("#phone__number").val();
   const appVerifier = window.recaptchaVerifier;
   signInWithPhoneNumber(auth,phoneNumber,appVerifier)
       .then(confirmationResult => {
          window.confirmationResult = confirmationResult;
          signIn();
       }).catch(error =>{
            window.grecaptcha.reset(window.recaptchaWidgetId);
      });
}

function signIn(){
   $("#sign__in").removeAttr("disabled").on("click",function(){
      const inputVerificationCode = $("#validation__code").val();
      confirmationResult.confirm(inputVerificationCode)
          .then(() => {
             window.location.assign("/index.htm");
          }).catch(error =>{
             $("#error").text(error);
      });
   });
}