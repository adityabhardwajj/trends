import React, { useEffect, useState } from "react";
import {  useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import {
    Button,
  } from "@mui/material";
import { BASE_URL } from "../../config";


const CheckFormElement = () => {

  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [message, setMessage] = useState('');
  


  
 const afterPayment = () => {

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    
    if (!clientSecret) {
      return;
    }


    stripe?.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {

      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          setError(true)

          break;
        default:
          setMessage("Something went wrong.");
          setError(true)

          break;
      }
    });
 };

  
useEffect(() => {
  afterPayment()
 },[stripe]);





  const handleSubmit = async (e : any) => {
    e.preventDefault();

    
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    setError(false);
    setMessage('');

    const { error } = await stripe.confirmPayment({
      elements,

      confirmParams: {

        return_url: `${BASE_URL}/order-success`,

        payment_method_data: {
          billing_details: {
            name : 'Aditya Bhardwaj',
            phone : '8269700955',
            email : 'aadityahardwaj5cs@gmail.com',
            address:{
              city : 'Bhopal',
              country : 'india',
              line1 : 'd15 patel nagar',
              line2 : '462022',
              state : 'MP'
            }
          },
        },
      },
    
    });


    if(error){
        setMessage(error.message ? error.message : '');
        setIsLoading(false);
        setError(true)
        return
      }

    setIsLoading(false);
  };


  return (
    <form >
      <p className="text-black mb-4">Complete your payment here!</p>

      <PaymentElement id="payment-element" options={ { layout: "tabs"}} />

      <Button
            variant="contained"
            fullWidth
            sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } , marginTop : '30px' ,marginBottom : '20px' }}
            disabled={isLoading || !stripe || !elements}
            onClick={handleSubmit}
          >
             {isLoading ? "Loading..." : "Confirm Payment"}
          </Button>

          {message && <div id="payment-message" style={{color : error ? 'red' : 'green' , fontWeight :'600' , fontSize : '20px'}}>{message}</div>}
    </form>
  );
};

export default CheckFormElement;
