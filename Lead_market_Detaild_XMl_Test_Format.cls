//Test Class: Lead_Market_MLM_API_test
//Edited: 03/03/2022
//Author: Ayush Jain
//Purpose: Generates XML for MLM API call.
public class Lead_Market_MLM_XML {
    
    public static void cleanOpp(Opportunity opp)
    {
        if(opp.Primary_Reason_Amount__c == null){
            opp.Primary_Reason_Amount__c = 0;
        }            
        if(opp.Account.BillingCity == null){
            opp.Account.BillingCity = '';
        }
        if(opp.Account.BillingState == null){
            opp.Account.BillingState = '';
        }
        if(opp.Account.BillingPostalCode == null){
            opp.Account.BillingPostalCode = '';
        }
        if(opp.Contact__r.Email == null){
            opp.Contact__r.Email = '';
        }
    }
    public static String xmlLeadMarket(Opportunity opp){        

//------------------------------------------------
        Map<String, String> primaryReasonOptMap = new Map<String, String>{
            
            // Appliances And Furniture
            	'TV' 							=> 'appliance_purchase',
                'Refrigerator' 					=> 'appliance_purchase',
                'Microwave' 					=> 'appliance_purchase',
                'Oven' 							=> 'appliance_purchase',
                'Washing Machine And/Or Dryer'  => 'appliance_purchase',
                'Lounge Suite' 					=> 'household_furnishings',
                'Bed' 							=> 'household_furnishings',
                'Mattress' 						=> 'lifestyle_other',
                'Office Equipment' 				=> 'business_hire_or_purchase_equipment',
                
            // Car Expenses
                'Vehicle Registration' 			   => 'vehicle_expenses',
                'Vehicle Insurance' 			   => 'vehicle_expenses',
                'Vehicle Maintenance (eg Service)' => 'vehicle_repairs',
                'Vehicle Repairs' 				   => 'vehicle_repairs',
                
            // Entertainment And Leisure
                'Health' 								 => 'lifestyle_other',
                'Dance' 								 => 'lifestyle_other',
                'Sport Or Music Lessons' 				 => 'lifestyle_other',
                'Concert Tickets' 						 => 'lifestyle_other',
                'Clothing And Items For A Special Event' => 'lifestyle_other',
                'Online Entertainment Purchases/Credits' => 'lifestyle_other',
                
            // Event Costs	
                'Anniversary'     => 'other_special_event',
                'Birthday Party'  => 'birthday',
                'Christmas Party' => 'other_special_event',
                'Funeral Costs'   => 'funeral',
                
            // Holiday & Travel Expenses
                'Accommodation' 			 => 'holiday_travel',
                'Airfares' 					 => 'holiday_travel',
                'Travel Insurance' 			 => 'holiday_travel',
                'Planned Holiday Activities' => 'holiday_travel',
                
            // Home / Apartment Repairs
                'Replace Carpet' => 'home_improvements_repair',
                'Fix Roof' 		 => 'home_improvements_repair',
                'Fix Fencing' 	 => 'home_improvements_repair',
                'Painting' 	  	 => 'home_improvements_repair',
                'Plumbing' 	  	 => 'home_improvements_repair',
                'Electrician'  	 => 'home_improvements_repair',
                
            // Insurance
                'Car' 		=> 'vehicle_expenses',
                //'Health' 	=> 'vehicle_expenses',
                'Home' 		=> 'home_other',
                'Contents'  => 'vehicle_expenses',
                'Pet' 		=> 'vet_bill',
                
            // Medical / Dental Expenses
                'Physiotherapy' => 'medical_dental_bill',
                'Chiropractor' 	=> 'medical_dental_bill',
                'Operation' 	=> 'medical_dental_bill',
                'Wisdom Teeth'  => 'medical_dental_bill',
                'Root Canal' 	=> 'medical_dental_bill',
                'Check-Up' 		=> 'medical_dental_bill',
                
            // Moving Expenses
                'Property Bond' 		 => 'rental_bond_cleaning',
                'Removalist Costs' 		 => 'recreational_activity',
                'Connection Of Services' => 'recreational_activity',
                'Insurance' 			 => 'recreational_activity',
                'Property Clean' 		 => 'rental_bond_cleaning',
                'Property Repair' 		 => 'recreational_activity',
                'Legal Costs' 			 => 'legal_fees',
                
             // Other Bill
                'Legal Fees' 									  => 'legal_fees',
                'Accounting Fees' 								  => 'tax_debt',
                'Tax Bill' 										  => 'tax_debt',
                'Fines' 										  => 'fine',
                'Education Fees' 								  => 'education',
                'Home Repairs Or Improvements' 					  => 'home_improvements_repair',
                'Council Or Water Rates/Body Corporate Fees' 	  => 'utilities_bill',
                'Utility Bills (eg. Gas, Elect, Phone) 1-2 Bills' => 'utilities_bill',
                'Utility Bills (eg. Gas, Elect, Phone) 3+ Bills'  => 'utilities_bill',
                
            // Product Purchases
                'TV' 				 => 'appliance_purchase',
                'Mobile Phone' 		 => 'technology_purchase',
                'Laptop' 			 => 'technology_purchase',
                'Computer'		 	 => 'technology_purchase',
                'Printer' 			 => 'technology_purchase',
                'Jewellery' 		 => 'lifestyle_other',
                'Sporting Equipment' => 'lifestyle_other',
                'Boat' 				 => 'other_vehicle_purchase',
                'Vehicle' 			 => 'other_vehicle_purchase',
                
            // Purchases for Childern
                'School Fees' 							 => 'school_education',
                'School Uniform'    					 => 'school_education',
                'School Activities' 					 => 'school_education',
                'Bedroom Furniture' 					 => 'household_furnishings',
                'Pram' 									 => 'lifestyle_other',
                'Baby Items Eg. Highchair, Change Table' => 'lifestyle_other',
                'Gifts Eg. Birthday Presents' 			 => 'lifestyle_other',
                'Parties' 								 => 'lifestyle_other',
                'Medical Expenses' 						 => 'medical_dental_bill',
                
            // Repayment / Refinacing Of Current Loans
                'Payment of Current Short Term Loan' => 'outstanding_debt',
                'Payment of Bank Loan' 				 => 'outstanding_debt',
                'Repay Credit Card Debt' 			 => 'outstanding_debt',
                
            // Vet Fees
                'Dog' 	=> 'vet_bill',
                'Cat' 	=> 'vet_bill',
                'Horse' => 'vet_bill'
                };
//------------------------------------------------

        //Personal Details - Applicant Details
        String title = (String.isNotBlank(opp.Contact__r.Salutation)) ? opp.Contact__r.Salutation : '';
        if(title != '')            
            title = title.replace('.', '');
        
        String birthDate = ((opp.Contact__r.BirthDate)!= NULL) ?  String.valueOf(opp.Contact__r.BirthDate)  : '';
        String firstName = (String.isNotBlank(opp.Contact__r.firstName)) ? opp.Contact__r.firstName : '';
        String lastName = (String.isNotBlank(opp.Contact__r.lastName)) ? opp.Contact__r.lastName : '';
        String mobile =(String.isNotBlank(opp.Contact__r.MobilePhone)) ? opp.Contact__r.MobilePhone : '';
        String email= (String.isNotBlank(opp.Contact__r.Email)) ? opp.Contact__r.Email : '';
        
        system.debug('title'+title);
        system.debug('bd'+birthDate);
        system.debug('fn'+firstName);
        system.debug('ln'+lastName);
        system.debug('em'+email);
        
        String billingStreet = (String.isNotBlank(opp.Account.BillingStreet)) ? opp.Account.BillingStreet : '';
        String billingCity = (String.isNotBlank(opp.Account.BillingCity)) ? opp.Account.BillingCity : '';
        String billingState = (String.isNotBlank(opp.Account.BillingState)) ? opp.Account.BillingState : '';
        String billingPostalCode = (String.isNotBlank(opp.Account.BillingPostalCode)) ? opp.Account.BillingPostalCode : '';
        
        String Employment_Status = (String.isNotBlank(opp.Contact__r.Employment_Status__c)) ? opp.Contact__r.Employment_Status__c : '';
        String Organisation_Name = (String.isNotBlank(opp.Contact__r.Employer_Name__c)) ? opp.Contact__r.Employer_Name__c : '';
        String PaymentFreq = String.isNotBlank(opp.Loan_Frequency__c) ? opp.Loan_Frequency__c : '';
        String Amount_Income = (String.isNotBlank(String.valueOf(opp.Contact__r.Annual_gross_income_before_tax__c))) ? String.valueOf(opp.Contact__r.Annual_gross_income_before_tax__c) : '';
        
        String LoanTerm = (String.isNotBlank(String.valueOf(opp.Loan_Term__c))) ? String.valueOf(opp.Loan_Term__c) : '';
        String Application_Date = Datetime.now().format('yyyy-MM-dd'); //'2017-01-01';
        String appReference = String.valueOf(opp.id);
        String amount_req = (String.isNotBlank(string.valueof(opp.Primary_Reason_Amount__c))) ? string.valueof(opp.Primary_Reason_Amount__c) : '';
        
        Boolean reasonOption = true;
        String reason;
        
        if(reasonOption){
            String primaryReasonOptValue = (String.isNotBlank(opp.Primary_Reason_Options__c))? opp.Primary_Reason_Options__c : '';
            reason = primaryReasonOptMap.get(primaryReasonOptValue);
        }
        else{
            reason = (String.isNotBlank(opp.Primary_Reason__c))? opp.Primary_Reason__c : '';
        }

        //String reason = (String.isNotBlank(opp.Primary_Reason__c))? opp.Primary_Reason__c : '';        
        reason = reason.replace('&', '-');
        reason = reason.replace('&amp;', '-');     
        System.debug('### reasonnew: ' + reason); 
        System.debug('### amount_req: ' + amount_req); 
        /*XmlStreamWriter xsw = new XmlStreamWriter();
        //<Lead>
        xsw.writeStartElement(null, 'Lead', null);
        //<Seller_Data>
        xsw.writeStartElement(null, 'Seller_Data', null);
        //<Client_Authority>false
        xsw.writeStartElement(null, 'Client_Authority', null); 
        xsw.writeCharacters('false');
        xsw.writeEndElement();
        //</Client_Authority>
        //<Customer_Authority>true
        xsw.writeStartElement(null, 'Customer_Authority', null);
        xsw.writeCharacters('true');
        xsw.writeEndElement();
        //</Customer_Authority>
        //<Customer_Authority_Type>Implicit
        xsw.writeStartElement(null, 'Customer_Authority_Type', null);
        xsw.writeCharacters('Implicit');
        xsw.writeEndElement();
        //</Customer_Authority_Type>
        
        //<Accept_Anti_Hawking>true
        xsw.writeStartElement(null, 'Accept_Anti_Hawking', null); 
        xsw.writeCharacters('true');
        xsw.writeEndElement();
        
      
        
        //</Accept_Anti_Hawking>
        //<CS_App_ID>
        xsw.writeStartElement(null, 'CS_App_ID', null);
        xsw.writeCharacters(String.valueOf(opp.Credit_Sense_AppID__c));
        xsw.writeEndElement();
        //</CS_App_ID>
        //<Use_MLM_Flow>true
        xsw.writeStartElement(null, 'Use_MLM_Flow', null); 
        xsw.writeCharacters('true');
        xsw.writeEndElement();
        //</Use_MLM_Flow>
        //<Lead_Reference>
        xsw.writeStartElement(null, 'Lead_Reference', null);
        xsw.writeCharacters(opp.ID);
        xsw.writeEndElement();
        //</Lead_Reference>
        
        xsw.writeEndElement(); //Seller_Data
      
        //</Seller_Data>
        //<Application>
        xsw.writeStartElement(null, 'Application', null); 
        //Application_Date
        xsw.writeStartElement(null, 'Application_Date', null);
        xsw.writeCharacters(Application_Date);
        xsw.writeEndElement();
        //E Application_Date
        //<Amount>200
        xsw.writeStartElement(null, 'Amount', null);
        xsw.writeCharacters(amount_req);
        xsw.writeEndElement();
        //</Amount>
        //<Reason>Other – Test
        xsw.writeStartElement(null, 'Reason', null);
        //xsw.writeCharacters('medical_dental_bill');
  
        xsw.writeCharacters(reason); 
        xsw.writeEndElement();
        //</Reason>
        //<Repayment_Cycle>
        xsw.writeStartElement(null, 'Repayment_Cycle', null);
        xsw.writeCharacters(PaymentFreq);
        xsw.writeEndElement();
        //</Repayment_Cycle>        		
        xsw.writeEndElement();
        //</Application>
        //<Applicant>
        xsw.writeStartElement(null, 'Applicant', null);
        //<Applicant_Type>Primary
        xsw.writeStartElement(null, 'Applicant_Type', null);
        xsw.writeCharacters('Primary');
        xsw.writeEndElement();
        
          // just for test purpose, remove after testing
        
        xsw.writeStartElement(null, 'Financials', null);
        xsw.writeStartElement('array', 'Financial', null);
        xsw.writeStartElement(null, 'Summary_Income', null);
        
        xsw.writeStartElement(null, 'Net_Amount', null);        				
        xsw.writeCharacters('4000');
        xsw.writeEndElement();
         
        xsw.writeStartElement(null, 'Gross_Amount', null);        				
        xsw.writeCharacters('5000');
        xsw.writeEndElement();
        
        xsw.writeStartElement(null, 'Frequency', null);        				
        xsw.writeCharacters('monthly');
        xsw.writeEndElement();
       
        xsw.writeEndElement();
        xsw.writeEndElement();
        xsw.writeEndElement();
        
         // to here
        
        //</Applicant_Type>
        //<Person_Applicant>
        xsw.writeStartElement(null, 'Person_Applicant', null);
        //Title>Mr
        xsw.writeStartElement(null, 'Title', null);
        xsw.writeCharacters(title);
        xsw.writeEndElement();
        //</Title>
        //<Date_Of_Birth>1980-01-01
        xsw.writeStartElement(null, 'Date_Of_Birth', null);
        xsw.writeCharacters(birthDate);
        xsw.writeEndElement();
        //</Date_Of_Birth>
        //<Last_Name>Ward
        xsw.writeStartElement(null, 'Last_Name', null);
        xsw.writeCharacters(lastName);
        xsw.writeEndElement();
        //</Last_Name>
        //<First_Name>Fredrick
        xsw.writeStartElement(null, 'First_Name', null);
        xsw.writeCharacters(firstName);
        xsw.writeEndElement();
        //</First_Name>
        //<Marital_Status>
        xsw.writeStartElement(null, 'Marital_Status', null);
        xsw.writeCharacters('');
        xsw.writeEndElement();
        //</Marital_Status>
        
        //<Contact_Methods>
        xsw.writeStartElement(null, 'Contact_Methods', null);
        //<Contact_Method>
        xsw.writeStartElement(null, 'Contact_Method', null);
        //<Contact_Other>
        xsw.writeStartElement(null, 'Contact_Other', null);
        //<Contact_Type>MOB
        xsw.writeStartElement(null, 'Contact_Type', null);        				
        xsw.writeCharacters('MOB');
        xsw.writeEndElement();
        //</Contact_Type>
        //<Contact_Value>
        xsw.writeStartElement(null, 'Contact_Value', null);        						                                      						
        xsw.writeCharacters(mobile);
        xsw.writeEndElement();
        //</Contact_Value>
        xsw.writeEndElement();
        //</Contact_Other>
        xsw.writeEndElement();
        //</Contact_Method>
        //EMAIL
        //<Contact_Method>
        xsw.writeStartElement(null, 'Contact_Method', null);
        //<Contact_Other>
        xsw.writeStartElement(null, 'Contact_Other', null);
        //<Contact_Type>MOB
        xsw.writeStartElement(null, 'Contact_Type', null);        				
        xsw.writeCharacters('EMAIL');
        xsw.writeEndElement();
        //</Contact_Type>
        //<Contact_Value>
        xsw.writeStartElement(null, 'Contact_Value', null);        						                                      						
        xsw.writeCharacters(email);
        xsw.writeEndElement();
        //</Contact_Value>
        xsw.writeEndElement();
        //</Contact_Other>
        xsw.writeEndElement();
        //</Contact_Method>
        //Address
        //<Contact_Method>
        xsw.writeStartElement(null, 'Contact_Method', null);
        //<Contact_Other> Address
        xsw.writeStartElement(null, 'Address', null);
        
        //<Contact_Type>Address_Line_1
        /*xsw.writeStartElement(null, 'Address_Line_1', null);        				
        xsw.writeCharacters(billingStreet);
        xsw.writeEndElement();*/
        //</Contact_Type>  
        
         
       /* //<Contact_Type>Address_Line_2
        xsw.writeStartElement(null, 'Address_Line_2', null);        				
        xsw.writeCharacters(billingStreet);
        xsw.writeEndElement();
        
        //</Contact_Type>  
        //<Contact_Type>Suburb
        xsw.writeStartElement(null, 'Suburb', null);        				
        xsw.writeCharacters(billingCity);
        xsw.writeEndElement();
        //</Contact_Type>  
        
        //<Contact_Type>State
        xsw.writeStartElement(null, 'State', null);        				
        xsw.writeCharacters(billingState);
        xsw.writeEndElement();
        //</Contact_Type>                     					
        
        //<Contact_Type>Postcode
        xsw.writeStartElement(null, 'Postcode', null);        				
        xsw.writeCharacters(billingPostalCode);
        xsw.writeEndElement();
        
        //</Contact_Type>      
        
        //<Contact_Type>Is_Current
        xsw.writeStartElement(null, 'Is_Current', null);        				
        xsw.writeCharacters('true');
        xsw.writeEndElement();
        //</Contact_Type>    
        //<Contact_Type>Residential_Type
        xsw.writeStartElement(null, 'Residential_Type', null);        				
        xsw.writeCharacters('false');
        xsw.writeEndElement();
        //</Contact_Type>    
        
        //<Contact_Type>Residential_Status
        xsw.writeStartElement(null, 'Residential_Status', null);        				
        xsw.writeCharacters('1');
        xsw.writeEndElement();
        //</Contact_Type>    
        
        //<Contact_Type>Time_At_Address_Months
        xsw.writeStartElement(null, 'Time_At_Address_Months', null);        				
        xsw.writeCharacters('');
        xsw.writeEndElement();
        //</Contact_Type>    
        
        xsw.writeEndElement();
        //</Contact_Other>
        xsw.writeEndElement();
        //</Contact_Method>
        xsw.writeEndElement();
        //</Contact_Methods>
        
        xsw.writeEndElement();
        //</Person_Applicant>
        
        //<Employment_History>
        xsw.writeStartElement(null, 'Employment_History', null);
        //  <Employment>
        xsw.writeStartElement(null, 'Employment', null);
        
        // <Is_Current>
        xsw.writeStartElement(null, 'Is_Current', null);
        xsw.writeCharacters('true');
        xsw.writeEndElement();
        //</Is_Current>	
        
        // <Organisation_Name>Steel Accountants
        xsw.writeStartElement(null, 'Organisation_Name', null);
        xsw.writeCharacters(opp.Contact__r.Employer_Name__C);
        xsw.writeEndElement();
        // </Organisation_Name>	
        
        xsw.writeEndElement();
        //  </Employment>
        xsw.writeEndElement();
        //</Employment_History>
        
        
        xsw.writeEndElement();
        //</Applicant>
        xsw.writeEndElement(); //end Lead
        xsw.writeEndDocument();
        String xmlOutput = xsw.getXmlString();
        xsw.close();
        system.debug('AYUSH=='+xmlOutput);*/
        string xmlOutput = '<Lead>' +
    '<Seller_Data>' +
        '<Client_Authority>false</Client_Authority>' +
        '<Customer_Authority>true</Customer_Authority>' +
        '<Customer_Authority_Type>Explicit</Customer_Authority_Type>' +
        '<Accept_Anti_Hawking>true</Accept_Anti_Hawking>' +
        '<CS_App_ID>'+String.valueOf(opp.Credit_Sense_AppID__c)+'</CS_App_ID>' +
        '<Use_MLM_Flow>true</Use_MLM_Flow>' +
        '<Lead_Reference>'+opp.id+'</Lead_Reference>' +
    '</Seller_Data>' +
    '<Application>' +
        '<Application_Date>2016-08-10</Application_Date>' +
        '<Interest_Rate>200</Interest_Rate>' +
        '<Repayment_Amount>200</Repayment_Amount>' +
        '<Fees>200</Fees>' +
        '<Type>Part Time</Type>' +
        '<Amount>200</Amount>' +
        '<Reason>business_hire_or_purchase_equipment</Reason>' +
        '<Repayment_Cycle>weekly</Repayment_Cycle>' +
        '<Repayment_Count>200</Repayment_Count>' +
        '<Description></Description>' +
    '</Application>' +
    '<Applicant>' +
        '<Applicant_Type>Primary</Applicant_Type>' +
        '<References>' +
            '<Reference>' +
                '<Relationship_Type>Previous Employer</Relationship_Type>' +
                '<Known_Applicant_Years>25</Known_Applicant_Years>' +
                '<Person_Other>' +
                    '<Title>Mr</Title>' +
                    '<Date_Of_Birth>1980-01-01</Date_Of_Birth>' +
                    '<Last_Name>Smith</Last_Name>' +
                    '<First_Name>Harry</First_Name>' +
                    '<Gender>M</Gender>' +
                    '<Contact_Methods>' +
                        '<Contact_Method>' +
                            '<Contact_Other>' +
                                '<Contact_Type>MOB</Contact_Type>' +
                                '<Contact_Value>0423547987</Contact_Value>' +
                            '</Contact_Other>' +
                        '</Contact_Method>' +
                        '<Contact_Method>' +
                            '<Contact_Other>' +
                                '<Contact_Type>EMAIL</Contact_Type>' +
                                '<Contact_Value>Test@gmail.com</Contact_Value>' +
                            '</Contact_Other>' +
                        '</Contact_Method>' +
                        '<Contact_Method>' +
                            '<Address>' +
                                '<Address_Line_1>19 Queen Street</Address_Line_1>' +
                                '<Address_Line_2></Address_Line_2>' +
                                '<Suburb>Brisbane CBD</Suburb>' +
                                '<State>QLD</State>' +
                                '<Postcode>4000</Postcode>' +
                                '<Is_Current>true</Is_Current>' +
                                '<Residential_Type>false</Residential_Type>' +
                                '<Residential_Status>1</Residential_Status>' +
                                '<Time_At_Address_Months>25</Time_At_Address_Months>' +
                            '</Address>' +
                        '</Contact_Method>' +
                    '</Contact_Methods>' +
                '</Person_Other>' +
            '</Reference>' +
        '</References>' +
        '<Financials>' +
            '<Financial>' +
                '<Detailed_Income>' +
                    '<Source>Employed</Source>' +
                    '<Type>Part Time</Type>' +
                    '<Frequency>weekly</Frequency>' +
                    '<Description></Description>' +
                    '<Net_Amount>4500</Net_Amount>' +
                    '<Gross_Amount>4500</Gross_Amount>' +
                    '<Is_Current>true</Is_Current>' +
                '</Detailed_Income>' +
            '</Financial>' +
            '<Financial>' +
                '<Detailed_Liability>' +
                    '<Type>Personal Loan</Type>' +
                    '<Frequency>monthly</Frequency>' +
                    '<Frequency_Amount>100</Frequency_Amount>' +
                    '<Balance>1000</Balance>' +
                    '<Start_Date>2015-07-25</Start_Date>' +
                    '<Estimated_End_Date>2017-03-01</Estimated_End_Date>' +
                    '<Description>true</Description>' +
                '</Detailed_Liability>' +
            '</Financial>' +
            '<Financial>' +
                '<Summary_Income>' +
                    '<Net_Amount>1000</Net_Amount>' +
                    '<Gross_Amount>1200</Gross_Amount>' +
                    '<Frequency>weekly</Frequency>' +
                '</Summary_Income>' +
            '</Financial>' +
            '<Financial>' +
                '<Summary_Liability>' +
                    '<Amount>1000</Amount>' +
                    '<Frequency>Part Time</Frequency>' +
                '</Summary_Liability>' +
            '</Financial>' +
        '</Financials>' +
        '<Bank_Accounts>' +
            '<Bank_Account>' +
                '<Account_Number>123456789</Account_Number>' +
                '<Account_Name>mytest</Account_Name>' +
                '<Bank_Name></Bank_Name>' +
                '<Account_Type>1</Account_Type>' +
                '<BSB>011234</BSB>' +
                '<Balance>0</Balance>' +
                '<Age_Of_Account>3</Age_Of_Account>' +
            '</Bank_Account>' +
        '</Bank_Accounts>' +
        '<Person_Applicant>' +
            '<Title>Mr</Title>' +
            '<Date_Of_Birth>1980-01-01</Date_Of_Birth>' +
            '<Last_Name>Ward</Last_Name>' +
            '<First_Name>Fredrick</First_Name>' +
            '<Gender>M</Gender>' +
            '<Dependents>2</Dependents>' +
            '<Marital_Status></Marital_Status>' +
            '<Contact_Methods>' +
                '<Contact_Method>' +
                    '<Contact_Other>' +
                        '<Contact_Type>Mobile</Contact_Type>' +
                        '<Contact_Value>0412341234</Contact_Value>' +
                    '</Contact_Other>' +
                '</Contact_Method>' +
                '<Contact_Method>' +
                    '<Contact_Other>' +
                        '<Contact_Type>Email</Contact_Type>' +
                        '<Contact_Value>nkumar@creditsense.com.au</Contact_Value>' +
                    '</Contact_Other>' +
                '</Contact_Method>' +
                '<Contact_Method>' +
                    '<Address>' +
                        '<Address_Line_1>5</Address_Line_1>' +
                        '<Address_Line_2>Eagle Street</Address_Line_2>' +
                        '<Suburb>Brisbane CBD</Suburb>' +
                        '<State>QLD</State>' +
                        '<Postcode>4000</Postcode>' +
                        '<Is_Current>true</Is_Current>' +
                        '<Residential_Type>false</Residential_Type>' +
                        '<Residential_Status>1</Residential_Status>' +
                        '<Time_At_Address_Months>25</Time_At_Address_Months>' +
                    '</Address>' +
                '</Contact_Method>' +
            '</Contact_Methods>' +
        '</Person_Applicant>' +
        '<Employment_History>' +
            '<Employment>' +
                '<Is_Current>true</Is_Current>' +
                '<Employment_Type>Full Time</Employment_Type>' +
                '<Occupation>Accountant</Occupation>' +
                '<Working_Hours_Weekly>40</Working_Hours_Weekly>' +
                '<Organisation_Name>Steel Accountants</Organisation_Name>' +
                '<Start_Date>2016-05-20</Start_Date>' +
                '<Employment_Contacts>' +
                    '<Person_Other>' +
                        '<Title>Mr</Title>' +
                        '<Date_Of_Birth>1980-01-01</Date_Of_Birth>' +
                        '<Last_Name>Johnson</Last_Name>' +
                        '<First_Name>James</First_Name>' +
                        '<Gender>M</Gender>' +
                        '<Contact_Methods>' +
                            '<Contact_Method>' +
                                '<Contact_Other>' +
                                    '<Contact_Type>MOB</Contact_Type>' +
                                    '<Contact_Value>047412589</Contact_Value>' +
                                '</Contact_Other>' +
                            '</Contact_Method>' +
                            '<Contact_Method>' +
                                '<Address>' +
                                    '<Address_Line_1>32 Albert Street</Address_Line_1>' +
                                    '<Address_Line_2></Address_Line_2>' +
                                    '<Suburb>Brisbane CBD</Suburb>' +
                                    '<State>QLD</State>' +
                                    '<Postcode>4000</Postcode>' +
                                    '<Is_Current>true</Is_Current>' +
                                    '<Residential_Type>false</Residential_Type>' +
                                    '<Residential_Status>1</Residential_Status>' +
                                    '<Time_At_Address_Months>25</Time_At_Address_Months>' +
                                '</Address>' +
                            '</Contact_Method>' +
                        '</Contact_Methods>' +
                    '</Person_Other>' +
                '</Employment_Contacts>' +
                '<Contact_Methods>' +
                    '<Contact_Method>' +
                        '<Contact_Other>' +
                            '<Contact_Type>Landline</Contact_Type>' +
                            '<Contact_Value>0726155948</Contact_Value>' +
                        '</Contact_Other>' +
                    '</Contact_Method>' +
                    '<Contact_Method>' +
                        '<Address>' +
                            '<Address_Line_1>21 Elizabeth Street</Address_Line_1>' +
                            '<Address_Line_2></Address_Line_2>' +
                            '<Suburb>Brisbane CBD</Suburb>' +
                            '<State>QLD</State>' +
                            '<Postcode>4000</Postcode>' +
                            '<Is_Current>true</Is_Current>' +
                        '</Address>' +
                    '</Contact_Method>' +
                '</Contact_Methods>' +
            '</Employment>' +
            '<Employment>' +
                '<Is_Current>false</Is_Current>' +
                '<Employment_Type>Full Time</Employment_Type>' +
                '<Occupation>Accountant</Occupation>' +
                '<Working_Hours_Weekly>40</Working_Hours_Weekly>' +
                '<Organisation_Name>We\'re Accountants</Organisation_Name>' +
                '<Start_Date>2015-08-10</Start_Date>' +
                '<End_Date>2016-05-10</End_Date>' +
                '<Employment_Contacts>' +
                    '<Person_Other>' +
                        '<Title>Mr</Title>' +
                        '<Date_Of_Birth>1980-01-01</Date_Of_Birth>' +
                        '<Last_Name>Smith</Last_Name>' +
                        '<First_Name>Harry</First_Name>' +
                        '<Gender>M</Gender>' +
                        '<Contact_Methods>' +
                            '<Contact_Method>' +
                                '<Contact_Other>' +
                                    '<Contact_Type>MOB</Contact_Type>' +
                                    '<Contact_Value>0423547987</Contact_Value>' +
                                '</Contact_Other>' +
                            '</Contact_Method>' +
                            '<Contact_Method>' +
                                '<Address>' +
                                    '<Address_Line_1>19 Queen Street</Address_Line_1>' +
                                    '<Address_Line_2></Address_Line_2>' +
                                    '<Suburb>Brisbane CBD</Suburb>' +
                                    '<State>QLD</State>' +
                                    '<Postcode>4000</Postcode>' +
                                    '<Is_Current>true</Is_Current>' +
                                    '<Residential_Type>false</Residential_Type>' +
                                    '<Residential_Status>1</Residential_Status>' +
                                    '<Time_At_Address_Months>25</Time_At_Address_Months>' +
                                '</Address>' +
                            '</Contact_Method>' +
                        '</Contact_Methods>' +
                    '</Person_Other>' +
                '</Employment_Contacts>' +
                '<Contact_Methods>' +
                    '<Contact_Method>' +
                        '<Contact_Other>' +
                            '<Contact_Type>Landline</Contact_Type>' +
                            '<Contact_Value>0726155948</Contact_Value>' +
                        '</Contact_Other>' +
                    '</Contact_Method>' +
                    '<Contact_Method>' +
                        '<Address>' +
                            '<Address_Line_1>5 Market Street</Address_Line_1>' +
                            '<Address_Line_2></Address_Line_2>' +
                            '<Suburb>Brisbane CBD</Suburb>' +
                            '<State>QLD</State>' +
                            '<Postcode>4000</Postcode>' +
                            '<Is_Current>true</Is_Current>' +
                        '</Address>' +
                    '</Contact_Method>' +
                '</Contact_Methods>' +
            '</Employment>' +
        '</Employment_History>' +
        '<Proof_Of_Identity>' +
            '<Identification>' +
                '<Type>Drivers License</Type>' +
                '<Document_ID>091153487</Document_ID>' +
                '<Issuer>QLD Government</Issuer>' +
                '<Date_Expiry>2019-07-22</Date_Expiry>' +
                '<Date_Issue>2015-07-21</Date_Issue>' +
                '<File_Name>ward-fredrick-driverslicense.png</File_Name>' +
                '<Is_Current>true</Is_Current>' +
            '</Identification>' +
        '</Proof_Of_Identity>' +
    '</Applicant>' +
'</Lead>';

        system.debug('Anurag-->'+xmlOutput);
        return xmlOutput;
        //return '<Lead> <Seller_Data> <Client_Authority>true</Client_Authority> <Customer_Authority>true</Customer_Authority> <CS_App_ID>'+opp.Credit_Sense_AppID__c+'</CS_App_ID> <Lead_Reference>'+opp.id+'</Lead_Reference> </Seller_Data> <Application> <Amount>400.00</Amount> <Reason>Appliances And Furniture</Reason> <Repayment_Cycle>Fortnightly</Repayment_Cycle> </Application> <Applicant> <Applicant_Type>Primary</Applicant_Type> <Person_Applicant> <Date_Of_Birth>2002-05-23</Date_Of_Birth> <Last_Name>popop</Last_Name> <First_Name>undelivered_Ecl</First_Name> <Contact_Methods> <Contact_Method> <Contact_Other> <Contact_Type>MOB</Contact_Type> <Contact_Value>8784545632</Contact_Value> </Contact_Other> </Contact_Method> <Contact_Method> <Contact_Other> <Contact_Type>EMAIL</Contact_Type> <Contact_Value>ayush.jain@mindruby.com</Contact_Value> </Contact_Other> </Contact_Method> <Contact_Method> <Address> <Address_Line_1>76 6700 null Chemin de la</Address_Line_1> <Suburb>Montréal</Suburb> <State>Quebec</State> <Postcode>H3S 2A8</Postcode> <Is_Current>true</Is_Current> <Time_At_Address_Months></Time_At_Address_Months> </Address> </Contact_Method> </Contact_Methods> </Person_Applicant> <Proof_Of_Identity> <Identification> <Type></Type> <Document_ID></Document_ID> </Identification> </Proof_Of_Identity> <Financials> <Financial> <Summary_Income> <Net_Amount>1000</Net_Amount> <Gross_Amount>1200</Gross_Amount> <Frequency>weekly</Frequency> </Summary_Income> </Financial><Financial><Detailed_Liability> <Type>Personal Loan</Type> <Frequency>monthly</Frequency> <Frequency_Amount>100</Frequency_Amount> <Balance>1000</Balance> <Start_Date>2015-07-25</Start_Date> <Estimated_End_Date>2017-03-01</Estimated_End_Date> <Description>true</Description> </Detailed_Liability> </Financial> <Financial> <Summary_Income> <Net_Amount>1000</Net_Amount> <Gross_Amount>1200</Gross_Amount> <Frequency>weekly</Frequency> </Summary_Income> </Financial> <Financial> <Summary_Liability> <Amount>1000</Amount> <Frequency>Part Time</Frequency></Summary_Liability></Financial></Financials></Applicant></Lead>';
    }
}
