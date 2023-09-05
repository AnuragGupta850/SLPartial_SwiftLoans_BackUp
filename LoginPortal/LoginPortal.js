import { LightningElement, track, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';


// Importing class functions
import attemptLogin from '@salesforce/apex/LoginPortal_Ctrl.attemptLogin';
import FetchLenderResponse from '@salesforce/apex/LoginPortal_Ctrl.FetchLenderResponse';
import FetchMyDetails from '@salesforce/apex/LoginPortal_Ctrl.FetchMyDetails';
import ForgotPassword from '@salesforce/apex/LoginPortal_Ctrl.ForgotPassword';
import ReturnMyDetails from '@salesforce/apex/LoginPortal_Ctrl.ReturnMyDetails';
import ApplicationURL from '@salesforce/apex/LoginPortal_Ctrl.ApplicationURL';
import ApplyNowResponse from '@salesforce/apex/LoginPortal_Ctrl.ApplyNowResponse';
import transactions from '@salesforce/apex/LoginPortal_Ctrl.transactions';
import repayMyLoanfetch from '@salesforce/apex/LoginPortal_Ctrl.repayMyLoanfetch';
import notifyError from '@salesforce/apex/LoginPortal_Ctrl.notifyError';
import logError from '@salesforce/apex/portalNewApplication_crtl.logError';

// import returnConstants from '@salesforce/apex/Common.returnConstants';

//import StageName from '@salesforce/schema/Opportunity.StageName';

import FORM_FACTOR from '@salesforce/client/formFactor';

// import { helperClass } from './helperClass';

export default class LoginPortal extends LightningElement
{

    @track steps = {login: true, mydetails: false, loading: false, error: false, applynow: false, myloans: false, lenderResponse: false, forgotPassword: false, afterforgotemail: false, bankstatementpage: false, logoutcard:false, repayloansTemp:false,noLoanActiveTemp:false, lenderSearchingMSG:false,userIsBlock:false,checkLoanPaidUser:false,seemsWrong:false, thankYouMsg:false};
 
    @track toast = { spinner: true };
 
    deviceSize = { small: 12, medium: 10, large: 4, currentSize: 12 };
 
    deviceSizeForButtons = { small: 12, medium: 10, large: 6, currentSize: 12 };
 
    customSize = { splitIntoTwo: 6, splitIntoFour: 3 };

    @track privacy_acknowledgement = "https://www.ozcashloans.com.au/privacy-consent/";
    @track credit_guide = "https://ozcashloans.com.au/credit-guide/";
    @track warning_borrowing = "https://ozcashloans.com.au/warning-about-borrowing/";
    @track electronic_authorisation = "https://www.ozcashloans.com.au/privacy-consent/";
    @track credit_sense_agency = "https://ozcashloans.com.au/bank-feed-terms-of-use/";

 
    // Helper Variables
    userstatus = '';
    @track renderingData = { previousloans: [], isLoggedIn: false, OppId: '', sfpuId: null, UserPasswordMatch: false, showSessionWarning: false, StatusVal:''};
 
    filteredData = { previousloans: [], applicationurl: '', debug: false };
 
    @track LenderResponse = { IP: '', CreatedDate: '', ConId: '' , AccId:'',Establishment_Fee:'',oppoAmount:'',loanPaiddUser:false, CurrentLedgerBalance:'', MinITLoanID:'', viewTransaction:false, transactionOppId:'',transactionObj:[], NoRecordFound:false, systemError:false,transBtn:false, blockUserDate:'',DaysBlock:'',LoanPaidUser:null, OpporName:null};

    @track TrackVarTemp = {disablefields:true,headerfooter:true, logoUrlDesktop:null, logoUrlMobile:null, loggedinuser:true, logoutbutton:true, OppStageName:false, app_ref:null }; 
 
    @track ButtonsVisibility = { updateDetails: true, saveDetails: false };
 
    @api origin;

    progressbarTypeDetailed = true;

    _minamount = 2100;
    _maxamount = 3500;
    _amountstepsize = 100;
 
 
 
    @wire(CurrentPageReference)
      getPageReferenceParameters(currentPageReference) {
         if (currentPageReference) {
            this.showLogs(currentPageReference.attributes.name);
            let pageApiName = currentPageReference.attributes.name;
            
            // if(pageApiName.includes('OCL'))
            //  {
             if(pageApiName == 'OCL_Login__c'){
               this.origin = 'OZ Cash Loans';
               this.TrackVarTemp.logoUrlDesktop = 'https://swiftloan.my.salesforce-sites.com/portal/resource/1492933781000/foundation/img/footer-logo-reverse2x.png';
               this.TrackVarTemp.logoUrlMobile = 'https://swiftloan--slpartial.sandbox.my.salesforce-sites.com/portal/resource/1492933781000/foundation/img/ocl-icon@2x.png';

               this.showLogs('yes'+pageApiName);
            //  }
            }
            else{
               this.showLogs('no'+ pageApiName);
            }
         }
      }

      topFunction() {
         const scrollOptions = {
             left: 0,
             top: 0,
             behavior: 'smooth'
         }
         window.scrollTo(scrollOptions);
     }
 
    // Form Data
    @track formData = {
       email: '', password: '', birthdate: '', phone: '', billingcity: '', billingstreet: '', firstname: '', lastname: '', forgor_email: '',
       billingstate: '', addresspostcode: '', forgotemailvalue: null, changedEmail:null
    };
 
    sticky = false;
    timeout = 4000;
    showError() {
       this.template
          .querySelector("c-custom-toast-notification")
          .showToast("error", "Something went wrong, please try after sometime.");
    }
    showWarning() {
       this.template
          .querySelector("c-custom-toast-notification")
          .showToast("warning", "your age should greater than 18 years, please enter your valid age");
    }
    showSuccess() {
       this.template
          .querySelector("c-custom-toast-notification")
          .showToast("success", "Updated Successfully!!");
    }
    showInfo() {
       this.template
          .querySelector("c-custom-toast-notification")
          .showToast("info", "Please enter valid email address!");
    }
 
    // for controlling logs  
    showLogs(message) {
       if (this.filteredData.debug) {
          console.log(message);
       }
       else {
          return;
       }
    }
 
 
    removeLoginCreds() {
       const dateNow = new Date();
       dateNow.setTime(dateNow.getTime() + (30 * 60 * 1000));
       this.showLogs('Login will Expire in ' + dateNow);
       var fetchCook = this.getCookie('sfpuid_ref');
       this.showLogs('removing login creds');
       this.showLogs('fetchCook-->' + fetchCook);
       this._interval = setInterval(() => {
 
          this.showLogs('***********Session expired*************');
          this.clearCookies('sfpuid_ref');
 
          fetchCook = this.getCookie('sfpuid_ref');
          this.showLogs('fetchCook-->' + fetchCook);
          clearInterval(this._interval);
          this.renderingData.showSessionWarning = true;
 
       }, (30 * 60 * 1000));
    }
 
    // Functions below
    connectedCallback() {
 
     
      this.TrackVarTemp.logoutbutton = false;
      this.showLogs(window.location.origin);

       this.showLogs('this.filteredData.previousloans----->' + this.filteredData.previousloans.ApplicationStatus);
       if (FORM_FACTOR !== 'Large')
          this.progressbarTypeDetailed = false;
 
 
       this.showLogs('connectedCallback IN');
       this.clearCookies('sfpuid_ref');
       this.steps = this.handleSteps(this.steps, 'login');
       // getnewApplicationURL()
       // {
       ApplicationURL({})
          .then(result => {
             let response = JSON.parse(result);
             var IsSuccess = response.IsSuccess;
             this.showLogs('IsSuccess' + IsSuccess);
             this.showLogs('response.ApplicationURL' + response.ApplicationURL);
 
             if (IsSuccess) {
 
 
                this.filteredData.applicationurl = response.ApplicationURL;
             }
 
             else {
                this.showError();
             }
          })
          .catch(error => {
             this.showLogs('Something went wrong' + error);
             this.showError();
                this.steps.loading = false;
 
             logError({
                'Message': 'LoginPortal: ' + error.message,
                'Method': 'connectedCallback'
             })
                .then(result => {
                   this.showLogs('Error Successfully logged ' + result);
                })
                .catch(error => {
                   this.showLogs('Something went wrong! ' + error.getmessage());
                });
             this.steps.loading = false;
          });
 
 
 
 
    }
 
    // Misc Functions
    createCookie(name, value, days) {
       // this.showLogs('Creating cookies');
       var expires;
       if (days) {
          const date = new Date();
          // date.setTime(date.getTime() + (days * 60 * 60 * 1000));
          date.setTime(date.getTime() + (30 * 60 * 1000));
          expires = "; expires=" + date.toGMTString();
          this.showLogs(expires)
 
          this.showLogs('date.toGMTString()-->' + date.toGMTString());
       }
       else {
          expires = "";
       }
       document.cookie = name + "=" + value + expires + "; path=/";
    }
 
    clearCookies(name) {
       this.createCookie(name, '', null);
    }
 
    getCookie(name) {
       var cookieString = "; " + document.cookie;
       var parts = cookieString.split("; " + name + "=");
       if (parts.length === 2) {
          return parts.pop().split(";").shift();
       }
       return null;
    }
 
 
    handleSteps(StepVar, StepName) {
       StepName = StepName.toString();
       for (var variable in StepVar) {
          StepVar[variable] = false;
       }
       StepVar[StepName] = true;
       return StepVar;
    }
 
 
    handleStepsUI(event) {
 
       // make sure to turn off the spinner after using this function
 
       var eventName = event.target.value;
       this.showLogs('eventName' + eventName);
       var getcookie = this.getCookie('sfpuid_ref');
       if ((eventName != 'forgot' && eventName != 'firstlogin' && eventName != 'forgotpasswordbutton' && eventName != 'newapplication')
          && (getcookie == null || getcookie == undefined || getcookie == '')
       ) {
          this.steps = this.handleSteps(this.steps, 'login');
          this.renderingData.isLoggedIn = false;
          this.showLogs('getcookie-->' + getcookie);
          return;
       }
       if (FORM_FACTOR !== 'Large')
          this.progressbarTypeDetailed = false;
 
       switch (eventName) {
 
          case 'login':
             break;
 
          case 'firstlogin':

             this.myloans(eventName);
             this.removeLoginCreds();
             break;
 
          case 'myloans':
             this.template.querySelector(".applynow").classList.remove("buttoncolor");
             this.template.querySelector(".myloans").classList.add("buttoncolor");
             this.template.querySelector(".mydetails").classList.remove("buttoncolor");
             this.template.querySelector(".repayMyLoan").classList.remove("buttoncolor");
             
             this.myloans(eventName);
            
             break;
 
          case 'applynow':
             this.template.querySelector(".myloans").classList.remove("buttoncolor");
             this.template.querySelector(".applynow").classList.add("buttoncolor");
             this.template.querySelector(".mydetails").classList.remove("buttoncolor");
             this.template.querySelector(".repayMyLoan").classList.remove("buttoncolor");
             this.showLogs('case-->' + eventName);
             this.applynowfun();
             
             break;
 
          case 'mydetails':
             this.template.querySelector(".applynow").classList.remove("buttoncolor");
             this.template.querySelector(".mydetails").classList.add("buttoncolor");
             this.template.querySelector(".myloans").classList.remove("buttoncolor");
             this.template.querySelector(".repayMyLoan").classList.remove("buttoncolor");
             this.mydetailsfun();
             this.showLogs('case-->' + eventName);
             
             break;

          case 'repayMyLoan':
            this.template.querySelector(".repayMyLoan").classList.add("buttoncolor");
            this.template.querySelector(".applynow").classList.remove("buttoncolor");
            this.template.querySelector(".mydetails").classList.remove("buttoncolor");
            this.template.querySelector(".myloans").classList.remove("buttoncolor");
            this.repayMyLoanfun();
            this.showLogs('case-->' + eventName);
            
            break;    

 
          case 'enableUpdateDetails':
             this.TrackVarTemp.disablefields = false;
             this.ButtonsVisibility = this.handleSteps(this.ButtonsVisibility, 'saveDetails');
             break;
 
          case 'UpdateChangedDetails':
             this.TrackVarTemp.disablefields = true;
             this.UpdateUserValue();
             this.ButtonsVisibility = this.handleSteps(this.ButtonsVisibility, 'updateDetails');
             break;
 
          case 'forgot':
             this.TrackVarTemp.disablefields = false;
             this.steps = this.handleSteps(this.steps, 'forgotPassword');
             break;
 
          case 'backtologinpage':
             this.steps = this.handleSteps(this.steps, 'login');
             break;
 
          case 'forgotpasswordbutton':
             this.ChangePassword();
             break;
 
          case 'newapplication':
             this.showLogs('newapplication-->');
             this.OpenNewApplication();
 
             break;
 
          default:
             this.steps = this.handleSteps(this.steps, 'error');
             break;
       }
    }
    OpenNewApplication() {
      this.steps.loading = true;
       window.open(this.filteredData.applicationurl, "_self");
    }
 
    applynowfun() {
      
      this.showLogs('inside the applynowfun');
      
       this.steps.loading = true;
       this.steps.lenderResponse = false;
       this.steps.mydetails = false;
       this.steps.myloans = false;
       this.hideTransaction();

       if(FORM_FACTOR != 'Large'){
       this.template.querySelector(".applynowval").classList.remove("slds-current-color");
       this.template.querySelector(".applynowval").classList.add("slds-icon-text-warning");
       this.template.querySelector(".repayloansval").classList.add("slds-current-color");
       this.template.querySelector(".myloansval").classList.add("slds-current-color");
       this.template.querySelector(".mydetailsval").classList.add("slds-current-color");
       this.template.querySelector(".logoutval").classList.add("slds-current-color");
       }

       this.showLogs('this.OppStageName4-->'+this.TrackVarTemp.OppStageName);  
       this.showLogs('this.LenderResponse.DaysBlock'+this.LenderResponse.DaysBlock);
 
       if (this.TrackVarTemp.OppStageName) {
 
          ApplyNowResponse({AccId: this.LenderResponse.AccId})
          .then(result => {
            this.showLogs('inside the applynowfun apex');
             let response = JSON.parse(result);
             this.showLogs('stage-->'+response.StageName)
             var IsSuccess = response.IsSuccess;
             this.showLogs('IsSuccess-->'+IsSuccess);
             this.showLogs('this.OppStageName5-->'+this.TrackVarTemp.OppStageName);
             this.showLogs('response.BankstatementResponse-->'+response.BankstatementResponse);
             
 
             if (IsSuccess) {
              
               if(response.BankstatementResponse)
               {
 
                var BankstatementURL = response.Bankstatement;
          
                   window.open(BankstatementURL, "_self");
                   this.steps.loading = false;
               }
             
             else if(response.StageName){

               this.showLogs('inside the stagename');
               
                  this.TrackVarTemp.app_ref = response.app_ref;
                  this.showLogs('this.app_ref -->'+this.TrackVarTemp.app_ref );
                  this.steps.applynow = true;
                  this.steps.loading = false;

             }
             else{
               this.steps = this.handleSteps(this.steps, 'seemsWrong');
               this.steps.loading = false;
             }
             
            }
             else {
                this.showLogs('Issucces false aaya');
                this.showError();
                this.steps = this.handleSteps(this.steps, 'seemsWrong');
                this.steps.loading = false;
             }
          })
          .catch(error => {
             this.showError();
             this.steps = this.handleSteps(this.steps, 'seemsWrong');
             this.steps.loading = false;
 
             logError({
                'Message': 'LoginPortal: ' + error.message,
                'Method': 'ReturnMyDetails'
             })
                .then(result => {
                   this.showLogs('Error Successfully logged ' + result);
                })
                .catch(error => {
                   this.showLogs('Something went wrong! ' + error.getmessage());
                });
          });
 
       }

       else if(this.LenderResponse.LoanPaidUser == false){

         this.steps = this.handleSteps(this.steps, 'checkLoanPaidUser');
         this.steps.loading = false;
       }
       else if(this.LenderResponse.DaysBlock > 0){

         this.steps = this.handleSteps(this.steps, 'userIsBlock');
         this.steps.loading = false;

       }
       else{
          this.showLogs('sfpuid_ref' + this.getCookie('sfpuid_ref'));
                  this.steps = this.handleSteps(this.steps, 'applynow');
                 this.steps.loading = false;
       }
 
    }
 
    mydetailsfun() {
       this.steps.lenderResponse = false;
       this.hideTransaction();
       this.steps.applynow = false;
       this.steps.myloans = false;
       this.steps.loading = true;

      if(FORM_FACTOR != 'Large'){

         this.template.querySelector(".applynowval").classList.add("slds-current-color");
         this.template.querySelector(".repayloansval").classList.add("slds-current-color");
         this.template.querySelector(".myloansval").classList.add("slds-current-color");
         this.template.querySelector(".mydetailsval").classList.remove("slds-current-color");
         this.template.querySelector(".mydetailsval").classList.add("slds-icon-text-warning");
         this.template.querySelector(".logoutval").classList.add("slds-current-color");


      }
       //this.steps = this.handleSteps(this.steps, 'loading');
 
       
       FetchMyDetails({ 'ConId': this.LenderResponse.ConId })
          .then(result => {
             let response = JSON.parse(result);
             this.showLogs('Result:-->' + response)
 
             var isSuccess = response.IsSuccess;
             this.showLogs('Update_details Issucces-->' + isSuccess);
             this.showLogs(response);
 
             if (isSuccess) {
                this.showLogs('UpdateData-->' + response.Data);
                response.Data.forEach(el => {
                   this.showLogs(el.Id);
                   //   this.UserData.update_Id = el.Id;
                   this.formData.email = el.Email
                   this.formData.birthdate = el.BirthDate;
                   this.formData.phone = el.MobilePhone;
                   this.formData.firstname = el.FirstName;
                   this.formData.lastname = el.LastName;
                   this.formData.billingstreet = el.BillingStreet;
                   this.formData.billingcity = el.BillingCity;
                   this.formData.billingstate = el.BillingState;
                   this.formData.addresspostcode = el.BillingPostalCode;
                   this.steps = this.handleSteps(this.steps, 'mydetails');
                });
                this.showLogs('upper in toast');
                this.steps.loading = false;
             }
 
             else {
                this.showLogs('IsSuccess false aaya hai');
                this.showError();
                this.steps.loading = false;
             }
          })
          .catch(error => {
             this.showLogs('Something went wrong 336' + error);
             this.showError();
             this.steps.loading = false;
 
             logError({
                'Message': 'LoginPortal: ' + error.message,
                'Method': 'FetchMyDetails'
             })
                .then(result => {
                   this.showLogs('Error Successfully logged ' + result);
                })
                .catch(error => {
                   this.showLogs('Something went wrong! ' + error.getmessage());
                });
             this.steps.loading = false;
          });
    }
 
 
     myloans(StepName) {
       /**
        * if this.sfpuid != null || undefined
        * {
        *handleSteps('logib)
        *  return;}
        */

        if(FORM_FACTOR != 'Large'){

         if(this.template.querySelector(".myloansval") != undefined || this.template.querySelector(".myloansval") != null){
            this.template.querySelector(".applynowval").classList.add("slds-current-color");
            this.template.querySelector(".repayloansval").classList.add("slds-current-color");
            this.template.querySelector(".myloansval").classList.remove("slds-current-color");
            this.template.querySelector(".myloansval").classList.add("slds-icon-text-warning");
            this.template.querySelector(".mydetailsval").classList.add("slds-current-color");
            this.template.querySelector(".logoutval").classList.add("slds-current-color");

         }
        }
      
        this.hideTransaction();
       
       
       this.LenderResponse.systemError = false;
       this.steps.lenderResponse = false;
       var isValidated = true;
       
       this.template.querySelectorAll('[data-id="loginPage"]').forEach(element => {
          this.showLogs('element' + element.label);
 
          switch (element.label) {
 
             case 'Email Address':
                this.showLogs(element.label, '=', element.value);
                if (element.value !== '' && element.value !== null && element.value !== undefined) {
 
                   this.showLogs('email value' + element.value);
                   this.formData.email = element.value;
                   this.showLogs('this.formData.email: ' + this.formData.email);
                }
                else {
                   this.showLogs('Inside else, Invalid email');
                   element.setCustomValidity("Enter a valid Email");
                   isValidated = false;
                }
                break;
 
             case 'Password':
                this.showLogs(element.label, '=', element.value);
                if (element.value !== '' && element.value !== null && element.value !== undefined) {
 
                   this.showLogs('pwd value', element.value);
                   this.formData.password = element.value;
                   this.showLogs('this.formData.password: ' + this.formData.password);
                }
                else {
                   this.showLogs('Inside else, Invalid password');
                   element.setCustomValidity("Enter a valid Password");
                   isValidated = false;
                }
                break;
             default:
                break;
          }
          element.reportValidity();
       });
 
 
       if (isValidated) {
 
          this.showLogs('********validation Successfull');
          // this.steps = this.handleSteps(this.steps, 'loading');
          this.steps.login = false;
          this.steps.applynow = false;
          this.steps.mydetails = false;
          this.steps.loading = true;
          attemptLogin({ 'username': this.formData.email, 'safeword': this.formData.password, 'origin': this.origin })
             .then(result => {
                // this.showLogs('Apex Result',result);
                var loginResponse = JSON.parse(result);
                this.showLogs('loginResponse: ' + loginResponse);
 
 
                if (loginResponse.isSuccess) {
 
                  this.TrackVarTemp.logoutbutton = true;
 
                   // this.showLogs('Apex Result',result);
 
                   if (loginResponse.grant === 'success') {

                     
                      this.renderingData.sfpuId = loginResponse.sfpuid_ref;
                      this.createCookie('sfpuid_ref', loginResponse.sfpuid_ref);
                      this.renderingData.isLoggedIn = true;
                      this.filteredData.previousloans.length = 0;
                      this.LenderResponse.AccId=loginResponse.AccId;
                      this.LenderResponse.blockUserDate = loginResponse.DateUntilBlock;
                      this.LenderResponse.DaysBlock = loginResponse.DaysBlock;
                      this.LenderResponse.LoanPaidUser =  loginResponse.LoanPaidUser;
                      this.LenderResponse.OpporName =  loginResponse.OppName;
                      this.showLogs('this.LenderResponse.LoanPaidUser-->'+this.LenderResponse.LoanPaidUser);
                      this.showLogs('this.LenderResponse.DaysBlock '+this.LenderResponse.DaysBlock );
 
                      loginResponse.opps.forEach(
                         (element) => {
                            this.showLogs('element' + element.Name);
                            this.showLogs('StageName' + element.StageName);
                            this.showLogs('Amount' + element.Amount);
                            this.showLogs('Lender' + element.LeadSoldTo);
                            this.showLogs('Opp' + element.OppId);
 
                            this.renderingData.OppId = element.OppId;
                            this.LenderResponse.ConId = element.ConId;
                           
 
 
                            var Status = 'Lender Search in Progress';
                            this.showLogs('this.OppStageName1-->' + this.TrackVarTemp.OppStageName);
 
                            if (element.StageName.includes('Pending') && element.MostRecentOpportunity == true){
 
                               Status = 'Pending BS';
                               this.TrackVarTemp.OppStageName = true;
                               //this.renderingData.StatusVal = 'Pending BS' ;
                               this.showLogs('this.OppStageName2-->' + this.TrackVarTemp.OppStageName);
 
                            }

                            else if(element.StageName.includes('Form') && element.MostRecentOpportunity == true){

                              Status = 'Pending Form';
                              this.TrackVarTemp.OppStageName = true;
                              //this.renderingData.StatusVal = 'Pending Application' ;
                              this.showLogs('this.OppStageName3-->' + this.TrackVarTemp.OppStageName);
                            }

                           
                           else if (element.StageName.includes('Awaiting Contract Sign')) {
 
                              Status = 'Please Sign Contract';
                              //this.renderingData.StatusVal = 'Sign Contract' ;
                           }
                           else if (!element.StageName.includes('Closed Lost') && 
                           !element.StageName.includes('Loan Paid') &&
                            !element.StageName.includes('Closed Won') &&
                             !element.StageName.includes('Awaiting Contract Sign') &&
                              !element.StageName.includes('Bank Statements Uploaded') &&
                               !element.StageName.includes('Pending') &&
                                !element.StageName.includes('Form')) {
 
                              Status = 'Pending';
                           }
                          
                           else if ((element.LeadSoldTo  !== null  && element.StageName.includes('Closed Lost')) 
                           || element.StageName.includes('Pending') || element.StageName.includes('Form')) {

                             Status = 'Lender Refered';
                          }
                           else if (element.MinIT_100 == true){
                              Status = 'Finalised'; 
                           }
                           else if (element.MinIT_100 == false && element.doNotSell == true && element.MostRecentOpportunity == true){
                             Status = 'Active';
                          }
                          else if (element.LeadSoldTo == null ) {
                           Status = 'Lender Search In Progress';
                           //this.renderingData.StatusVal = 'LenderSearching';
                        }
                            else{
                              Status = 'Processing';
                            }
                            this.filteredData.previousloans.push(
                               { Name: element.Name, ApplicationStatus: Status, ApplicationDate: element.CreatedDate, Amount: element.Amount, OppId: element.OppId }
                            );
                         }
                      );
                      // this.renderingData.previousloans = loginResponse.opps;
                      this.steps.loading = false;
                      this.handleSteps(this.steps, 'myloans')
 
                      this.showLogs('this.filteredData.previousloans bahar----->' + this.filteredData.previousloans.ApplicationStatus);
                   }
                   else {
                     
                      this.showLogs('login failed' + loginResponse.grant);
                      this.renderingData.UserPasswordMatch = true;
                      this.steps = this.handleSteps(this.steps, 'login');
                      this.steps.loading = false;
                   }
                }
                else {
                   
                   this.steps = this.handleSteps(this.steps, 'login');
                   this.steps.loading = false;
                   this.TrackVarTemp.logoutbutton = false;
                }
             })
             .catch(error => {
                this.showLogs('Apex Error' + error);
                this.showError();
                this.steps.loading = false;
 
                logError({
                   'Message': 'LoginPortal: ' + error.message,
                   'Method': 'attemptLogin'
                })
                   .then(result => {
                      this.showLogs('Error Successfully logged ' + result);
                   })
                   .catch(error => {
                      this.showLogs('Something went wrong! ' + error.getmessage());
                   });
             })
       }
       else {
          this.showLogs('validation false');
 
       }

    }

    repayMyLoanfun(){
      this.steps.loading = true;
      this.hideTransaction();


      if(FORM_FACTOR != 'Large'){
        this.template.querySelector(".applynowval").classList.add("slds-current-color");
        this.template.querySelector(".repayloansval").classList.remove("slds-current-color");
        this.template.querySelector(".repayloansval").classList.add("slds-icon-text-warning");
        this.template.querySelector(".myloansval").classList.add("slds-current-color");
        this.template.querySelector(".mydetailsval").classList.add("slds-current-color");
        this.template.querySelector(".logoutval").classList.add("slds-current-color");
      }

      
      
      //this.steps.repayloansTemp = true;
      repayMyLoanfetch({ 'accId': this.LenderResponse.AccId })
      .then(result=>{

         var response = JSON.parse(result);
         if(response.IsSuccess){
            if(response.StageName)
            {
               this.showLogs('CurrentLedger-?'+response.CurrentLedgerBalance);
         this.LenderResponse.MinITLoanID  = response.MinITLoanID;
         this.LenderResponse.CurrentLedgerBalance = response.CurrentLedgerBalance;
         this.steps = this.handleSteps(this.steps, 'repayloansTemp');
         this.steps.loading = false;

         this.showLogs('this.LenderResponse.CurrentLedgerBalance-?'+this.LenderResponse.CurrentLedgerBalance);
         }
         else{
            this.steps.loading = false;
            this.steps = this.handleSteps(this.steps, 'noLoanActiveTemp');


         }
      }
         else{
            this.showLogs('Something went wrong');
            this.steps.loading = false;
         }

      })
      .catch(error=>{
         this.showError();
         this.steps.loading = false;

      })
    }
 
    hideerror() {
       this.renderingData.UserPasswordMatch = false;
    }
 
 
 
    UpdateUserValue() {
       var myMap = new Map();
       this.template.querySelectorAll('[data-id="mydetailsvalue"]').forEach(element => {
 
          switch (element.label) {
 
             case 'First Name':
                if (element.value != this.formData.firstname) {
 
                   myMap.set('FirstName', element.value);
                }
                else { }
                this.showLogs(element.label, '----' + element.value);
                break;
 
             case 'Last Name':
                if (element.value != this.formData.lastname) {
 
                   myMap.set('LastName', element.value);
                }
                else { }
                this.showLogs(element.label, '----' + element.value);
                break;
 
             case 'Email':
                if (element.value != this.formData.email) {
 
                   myMap.set('Email', element.value);
                   this.formData.changedEmail = element.value;
                }
                else { }
                this.showLogs(element.label, '----' + element.value);
                break;
 
             case 'Birthdate':
                if (element.value != this.formData.birthdate) {
                   // let maxYear = new Date().getFullYear() - 18;
                   // this.showLogs('maxYear-->'+maxYear);
                   // var inputyear = new Date(element.value);
                   // var year = inputyear.getFullYear();
                   // this.showLogs('year-->'+year);
                   // if(year < maxYear){
                   myMap.set('Birthdate', element.value);
                   // }
                   // else{
                   //    this.showWarning();
                   // }
                }
                else { }
                this.showLogs(element.label, '----' + element.value);
                break;
 
             case 'Phone':
                if (element.value != this.formData.phone) {
 
                   myMap.set('Phone', element.value);
                }
                else { }
                this.showLogs(element.label, '----' + element.value);
                break;
 
             case 'Billing City':
                if (element.value != this.formData.billingcity) {
 
                   myMap.set('BillingCity', element.value);
                }
                else { }
                this.showLogs(element.label, '----' + element.value);
                break;
 
             case 'Billing Street':
                if (element.value != this.formData.billingstreet) {
 
                   myMap.set('BillingStreet', element.value);
                }
                else { }
                this.showLogs(element.label, '----' + element.value);
                break;
 
             case 'Billing State':
                if (element.value != this.formData.billingcity) {
 
                   myMap.set('BillingState', element.value);
                }
                else { }
                this.showLogs(element.label, '----' + element.value);
                break;
 
             case 'Address Postcode':
                if (element.value != this.formData.addresspostcode) {
 
                   myMap.set('BillingPostalCode', element.value);
 
                   this.showLogs('before edit' + this.formData.addresspostcode);
 
                   this.showLogs('after edit' + element.value);
                }
                else { }
                break;
 
             default:
                break;
          }
       });
 
       myMap.set('ConId', this.LenderResponse.ConId);
       var obj = Object.fromEntries(myMap);
       const jsonmap = JSON.stringify(obj);
 
       this.steps.loading = true;
       ReturnMyDetails({ 'getvalues': jsonmap })
          .then(result => {
 
             let response = JSON.parse(result);
 
             var isSuccess = response.IsSuccess;
             this.showLogs('UPDATE isSuccess', isSuccess);
 
             this.steps.loading = false;
             if (isSuccess) {
               
                this.topFunction();
                this.showSuccess();
                  if(this.formData.changedEmail != null){
                if(this.formData.email != this.formData.changedEmail){

                  this.renderingData.isLoggedIn = false;
                  this.TrackVarTemp.logoutbutton = false;
                  this.clearCookies('sfpuid_ref');
                  this.steps = this.handleSteps(this.steps, 'login');

                }
                  }
                this.showLogs('Issucces true aaya');
             }
             else {
                this.showLogs('Issucces false aaya');
                this.showError();
             }
          })
          .catch(error => {
            this.showError();
            this.steps.loading = false;
 
             logError({
                'Message': 'LoginPortal: ' + error.message,
                'Method': 'ReturnMyDetails'
             })
                .then(result => {
                   this.showLogs('Error Successfully logged ' + result);
                })
                .catch(error => {
                   this.showLogs('Something went wrong! ' + error.getmessage());
                });
          });
    }
 
    hideModalBox(){
       this.steps.logoutcard = false;
       this.steps = this.handleSteps(this.steps, 'myloans');
 
    }
 
    redirectToDetails(event) {
 
       this.steps.myloans = false;
       this.steps.loading = true;
       this.showLogs('redirect details-->' + event.target.value);
       this.LenderResponse.transactionOppId = event.target.value
       FetchLenderResponse({ 'OppId': event.target.value })
          .then(result => {
 
            
             let response = JSON.parse(result);
             var isSuccess = response.IsSuccess;
             var RedirectToLender = response.RedirectToLender;
             this.showLogs('response.Data.StageName'+response.Data.StageName);
 
 
             this.showLogs('UPDATE isSuccess' + isSuccess);
 
             if (isSuccess) {
               this.showLogs('inside the issuccess');
               this.userstatus = response.Data.StageName;

               this.showLogs('this.userstatus-?'+this.userstatus);
               
                var BankstatementURL = response.Data.BankstatementURL;
 
                if (RedirectToLender) {
 
                  this.showLogs('inside the Redirect');
                   this.LenderResponse.IP = response.Data.IP;
                   this.LenderResponse.CreatedDate = response.Data.CreateDate;
                   this.LenderResponse.oppoAmount = response.Data.Amount;
                   this.LenderResponse.Establishment_Fee = response.Data.Establishment_Fee;
                   

                   if(this.userstatus == 'Loan Paid' || this.userstatus == 'Closed Won' )
                   {
                     this.LenderResponse.loanPaiddUser = true;
                   
                   }
                   else{
                     this.LenderResponse.loanPaiddUser = false;
                   }

 
 
                   this.showLogs('Createdate' + this.LenderResponse.CreatedDate);
                   //this.steps.lenderResponse = true;  
                   this.steps = this.handleSteps(this.steps, 'lenderResponse');
                   this.steps.loading = false;
                }
                else if( this.userstatus.includes('Form') || this.userstatus.includes('Pending'))
                {
                     this.applynowfun();
                }
                else if(this.userstatus.includes('Awaiting Contract Sign')){

                  this.showLogs('inside the sign contract');
                  if(response.Data.AwaitingSign){
                     window.open(response.Data.SignContractURL, "_self");
                  }

                }
                else if(this.userstatus == 'Bank Statements Uploaded'){

                  this.showLogs('inside the bank statement');
                  this.steps = this.handleSteps(this.steps, 'lenderSearchingMSG');
                  this.steps.loading = false;

                }

                else{

                  this.showLogs('inside the else part');

                }
 
               //  else if(this.renderingData.StatusVal == 'Pending BS') {
               //     window.open(BankstatementURL, "_self");
               //     this.steps.loading = false;
 
               //  }
             }
             else {
                this.steps.lenderResponse = false;
                this.steps.bankstatementpage = false;
                this.showLogs('isSucees false aaya hai');
                this.steps.loading = false;
             }
          })
          .catch(error => {
             this.steps.lenderResponse = false;
             this.showError();
             this.steps.loading = false;
 
             logError({
                'Message': 'LoginPortal: ' + error.message,
                'Method': 'FetchLenderResponse'
             })
                .then(result => {
                   this.showLogs('Error Successfully logged ' + result);
                })
                .catch(error => {
                   this.showLogs('Something went wrong! ' + error.getmessage());
                });
             this.steps.loading = false;
             // window.alert('We are facing some issues Plaese try again later');
          });
       this.showLogs('redirect details-->' + event.target.value);
    }

    viewMyTransactions(){

      
      this.showLogs('OppId-->'+this.LenderResponse.transactionOppId);
      this.steps.loading = true;
      this.LenderResponse.transBtn = true;

      transactions({'OppId':this.LenderResponse.transactionOppId})
      .then(result=>{
         this.showLogs('bdiya');
         var response = JSON.parse(result);
         this.showLogs('response-->'+response);
         // if(response.Recordstrans == 'two'){
            this.showLogs('response.transactionInfo--?'+response.subtransLST);
         var transactionInfo = response.subtransLST.toString();
        //var transactionInfo = "OK: Transaction Date~Transaction Type~Debit~Credit~Balance|2/02/2023~Credit Fees and Charges~144~0~144|2/02/2023~Loan Advance~600~0~744|7/02/2023~Direct Debit Payment~0~58.29~685.71|14/02/2023~Direct Debit Payment~0~58.29~627.42|21/02/2023~Direct Debit Payment~0~58.29~569.13|28/02/2023~Direct Debit Payment~0~58.29~510.84|2/03/2023~Permitted Monthly Fee~24~0~534.84|7/03/2023~Direct Debit Payment~0~58.29~476.55|14/03/2023~Direct Debit Payment~0~58.29~418.26|21/03/2023~Direct Debit Payment~0~58.29~359.97|28/03/2023~Direct Debit Payment~0~58.29~301.68|30/03/2023~Direct Debit Letter Fee~7~0~308.68|30/03/2023~Dishonour Fee~15~0~323.68|30/03/2023~Direct Debit Reversal~58.29~0~381.97|2/04/2023~Permitted Monthly Fee~24~0~405.97|4/04/2023~Direct Debit Payment~0~58.29~347.68|5/04/2023~Direct Payment~0~44.06~303.62|5/04/2023~Direct Payment~0~58.23~245.39|5/04/2023~Direct Payment~0~58.29~187.1|6/04/2023~Dishonour Fee~15~0~202.1|6/04/2023~Direct Debit Reversal~58.29~0~260.39|11/04/2023~Direct Debit Payment~0~58.29~202.1|13/04/2023~Direct Debit Reversal~58.29~0~260.39|18/04/2023~Direct Debit Payment~0~58.29~202.1|19/04/2023~Direct Debit Letter Fee~7~0~209.1|19/04/2023~Dishonour Fee~15~0~224.1|19/04/2023~Direct Payment~0~22~202.1|19/04/2023~Direct Payment~0~58.29~143.81|20/04/2023~Direct Debit Letter Fee~7~0~150.81|20/04/2023~Dishonour Fee~15~0~165.81|20/04/2023~Direct Debit Reversal~58.29~0~224.1|25/04/2023~Direct Debit Payment~0~58.29~165.81|2/05/2023~Permitted Monthly Fee~24~0~189.81|2/05/2023~Direct Debit Payment~0~14.23~175.58|9/05/2023~Direct Debit Payment~0~58.29~117.29|12/05/2023~Direct Payment~0~117.29~1.27897692436818E-13|";
        
         if(response.IsSuccess){
         if (transactionInfo.substring(0, 3) == "OK:") {
            if(transactionInfo.includes("OK: No Records")){
               this.LenderResponse.NoRecordFound = true;

            }
            else{

               transactionInfo = transactionInfo.substring(3);
         
         let trans = transactionInfo.split("|");
         this.showLogs('trans->'+trans[0]);
       
         const eachTransrecord = [];

         for (let i in trans) {

            trans[i] = trans[i].replace(/'/g, '');

           const singleTransInfo = trans[i].split("~");
           let number = parseInt(singleTransInfo[4]);

           //console.log('jjjjjjjjjjj->',singleTransInfo[4].toFixed(2));

          if(i==0){

          }else{
           const newRecord = {
             TransactionDate: singleTransInfo[0],
             TransactionType: singleTransInfo[1],
             Debit: singleTransInfo[2],
             Credit: singleTransInfo[3],
             Balance: number.toFixed(2)
           };
         
           eachTransrecord.push(newRecord);
         }
      }
         this.LenderResponse.transactionObj = eachTransrecord;

         this.showLogs('eachTransrecord'+JSON.stringify(eachTransrecord));
         
         this.steps.loading = false;
         this.LenderResponse.viewTransaction = true; 

        // this.steps.loading = false; // remove this line please

            }
            // Do something if the transaction is successful
          }

          else if(transactionInfo.includes("Loan does not belong")){
            this.LenderResponse.systemError = true;

          }
          else{
            this.steps.loading = false;
            this.LenderResponse.systemError = true;

          }
         }
          else{
            this.steps.loading = false;
            this.LenderResponse.systemError = true;
          }

          this.steps.loading = false;
         
      })
      .catch(error=>{
         this.showLogs('not bdiya');
         this.showError();
         this.steps.loading = false;
      })
    }

    hideTransaction(){
      this.LenderResponse.viewTransaction = false;
      this.LenderResponse.transBtn = false;
    }
 
    handleLogin() {
      
       this.showLogs('LogOut');
       //this.steps.logoutcard=true;
       if(FORM_FACTOR != 'Large'){
       this.template.querySelector(".applynowval").classList.add("slds-current-color");
       this.template.querySelector(".repayloansval").classList.add("slds-current-color");
       this.template.querySelector(".myloansval").classList.add("slds-current-color");
       this.template.querySelector(".mydetailsval").classList.add("slds-current-color");
       this.template.querySelector(".logoutval").classList.remove("slds-current-color");
       this.template.querySelector(".logoutval").classList.add("slds-icon-text-warning");
       }
       this.hideTransaction();
       this.steps = this.handleSteps(this.steps, 'logoutcard');
    }
    handlelogout(){
     
       this.renderingData.isLoggedIn = false;
       this.TrackVarTemp.logoutbutton = false;
       this.clearCookies('sfpuid_ref');
       this.steps = this.handleSteps(this.steps, 'login');
    }
 
    handleState(event) {
       this.value = event.detail.value;
    }
 
    get state() {
       return [
          { label: 'ACT', value: 'ACT' },
          { label: 'NSW', value: 'NSW' },
          { label: 'NT', value: 'NT' },
          { label: 'QLD', value: 'QLD' },
          { label: 'SA', value: 'SA' },
          { label: 'TAS', value: 'TAS' },
          { label: 'VIC', value: 'VIC' },
          { label: 'WA', value: 'WA' },
       ];
    }
  
    ChangePassword() {

       

      //this.formData.forgotemailvalue  = this.template.querySelector('[data-id = "Emailval"]');
      this.showLogs('query-->'+this.template.querySelector('[data-id = "Emailval"]').value);
      var forgotemailvalue = this.template.querySelector('[data-id = "Emailval"]').value;

      
      const emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[a-z]{1,3}\.[a-z]{1,3}\.[a-z]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/;
      this.showLogs('emailRegex-->'+emailRegex.test(forgotemailvalue));

      if(forgotemailvalue == '' || forgotemailvalue == null || forgotemailvalue == undefined || emailRegex.test(forgotemailvalue) == false){
          this.showLogs('forgotemailvalue-->'+ forgotemailvalue);
         this.showInfo();
          return;
       }
      
       this.showLogs('Frgt_email_value-->' + forgotemailvalue);
      //  if(forgotemailvalue != null || forgotemailvalue != '') {
          ForgotPassword({ e_mail: forgotemailvalue })
             .then(result => {
                let response = JSON.parse(result);
                var isSuccess = response.isSuccess;
                if(isSuccess) {
                   this.showLogs('isSuccess' + isSuccess);
                   this.steps = this.handleSteps(this.steps, 'afterforgotemail');
 
                }
                else{
                  this.showLogs('isSuccess' + isSuccess);
                  this.steps = this.handleSteps(this.steps, 'afterforgotemail');
                }
             })
 
             .catch(error => {
 
                this.showLogs(error);
                this.showError();
                this.steps.loading = false;
                
 
                logError({
                   'Message': 'LoginPortal: ' + error.message,
                   'Method': 'ForgotPassword'
                })
                   .then(result => {
                      this.showLogs('Error Successfully logged ' + result);
                   })
                   .catch(error => {
                      this.showLogs('Something went wrong! ' + error.getmessage());
                   });
             });
      //  }
      //  else {
      //    this.showInfo();
      //     this.showLogs(error);
      //  }
 
    }

    ErrorNotification(){
      this.steps.loading = true;

      let errorMsg = this.template.querySelector('[data-id="ErrorNotify"]').value;
      this.showLogs('errorMsg->'+errorMsg);

      var myMap = new Map();

      myMap.set('errorMsg',errorMsg);
      myMap.set('AccId',this.LenderResponse.AccId);

      var obj = Object.fromEntries(myMap);
      const jsonmap = JSON.stringify(obj);

      notifyError({Error:jsonmap})
      .then(result =>{
         let response = JSON.parse(result);
         this.showLogs('response aaya: '+response);
         if(response.IsSuccess){

            this.steps = this.handleSteps(this.steps, 'thankYouMsg');
            this.steps.loading = false;
         }
      })
      .catch(error=>{
         this.showLogs('error->',error);
         this.showLogs(error);
         this.steps.loading = false;
      })

    }
 
 
 }

//{
//     @api content;

//     @track steps = {one:true}

//     handleOkay() {
//         this.close('okay');
//     }
//     connectedCallback(){

//         helperClass.showLogs('Message');
//     }

    
//    deviceSize = { small: 12, medium: 10, large: 4, currentSize: 12 };

//    deviceSizeForButtons = { small: 12, medium: 10, large: 6, currentSize: 12 };
// }
