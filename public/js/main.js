$(document).ready(function() {

  // Place JavaScript code here...
    $('.js-projectMember-avatar, .js-projectMember').tooltip();
  
    document.helpers = function ($, document, StripeCheckout) {

    var handler = StripeCheckout.configure({
      key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
      image: '/img/logo.png',
      token: function (token, args) {
        console.log(token);
        // Use the token to create the charge with a server-side script.
      }
    });
    var checkout = function (name, desc, amt, emailAddress) {

      // Open Checkout with further options
      handler.open({
        name: name,
        description: desc,
        amount: amt * 100.00,
        email: emailAddress
      });

    }

    return { checkout: checkout };


  }($, document, StripeCheckout);
  

});
