

$(document).ready(function() {
   
   var inputtext = $("#search-box");
   var searchbutton = $("#search-btn");

   $(searchbutton).click(function(e){
   	if(inputtext.val() == "" || inputtext.val() == null || inputtext.val() == undefined)
   	{
   		e.preventDefault();
   	}
   });

//product page
   var servings = $("#servings");
    var quantity = $('input[id^="quantity"]');
    var price = $('input[id^="price"]');
    var total_price = $("#total");
      var i=0;
    var arr_price = [];
    var total=0;

    //on chnage of servings
    $(servings).change(function(){
       console.log($(quantity).val());
       $(quantity).val($(servings).val());
       $(quantity).change();
       $(total_price).change();
    });

    
    $(price).each(function(index,value) {
    arr_price[i++]=value.value;
    total = total + Number(value.value);
    });

    total_price.val(total.toFixed(2));

    //onchnage of ingredient quantity
    $(quantity).change(function(index,value){
       var forIndex = $(this);
       var actualValue = $(this).val();
       var actualIndex = quantity.index(forIndex);
       var a = Number(arr_price[actualIndex]);
       var b = Number(actualValue);
       var c = a*b;
       price[actualIndex].value = c;
       total = 0;
       $(price).each(function(index,value) {
       total = total + Number(value.value);
       });
       total_price.val(total.toFixed(2));
       $(total_price).change();
    });

    //on change of total
    $(total_price).change(function(){
      var totalValue = Number(total_price.val());
      var errorMessage = $("#errorAlert");
        if(totalValue !== 0){
           errorMessage.addClass('hidden'); 
        }

    });

    //checkout page
    var fname = $("#first_name").val();
    var lname = $("#last_name").val();
    var country = $("#country").val();
    var address = $("#address").val();
    var city =$("#city").val();
    var state =$("#state").val();
    var email = $("#email").val();
    var phone = $("#phone").val();
    var zip = $("#zip_code").val();
    var cardNumber = $("#card_no").val();
    var cardCode = $("#card_code").val();
    var expMonth = $("#exp_month").val();
    var expYear = $("#exp_year").val();

    var btn_place_order = $("#placeorder");
    var errorMessage = $("#errorAlert");
    var flag = true;

    $(btn_place_order).click(function(e){
      var flag = true;
      e.preventDefault();
      
       if(!validate(country)){
          errorMessage.removeClass('hidden');
          errorMessage.text("Enter Country");
          flag = false;
      }
      if(!validate(fname)){
        console.log('vaildation for first name failed');
          errorMessage.removeClass('hidden');
          errorMessage.text("Enter First Name");
          flag = false;
      }
      // if(!validate(lname)){
      //   console.log('vaildation for first name failed');
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter Last Name");
      //     flag = false;
      // }
      // if(!validate(address)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter Address");
      //     flag = false;
      // }
      // if(!validate(city)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter City");
      //     flag = false;
      // }
      // if(!validate(state)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter State");
      //     flag = false;
      // }
      // if(!validate(email)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter Email");
      //     flag = false;
      // }
      // if(!validate(phone)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter valid Phone Number");
      //     flag = false;
      // }
      // if(!validate(zip)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter valid Zip Code");
      //     flag = false;
      // }
      // if(!validate(cardNumber)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter valid Card Number");
      //     flag = false;
      // }
      // if(!validate(cardCode)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter valid CVV");
      //     flag = false;
      // }
      // if(!validate(expMonth)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter valid Expiry Month");
      //     flag = false;
      // }
      // if(!validate(expYear)){
      //     errorMessage.removeClass('hidden');
      //     errorMessage.text("Enter valid Expiry Year");
      //     flag = false;
      // }
      if(flag){
        errorMessage.addClass('hidden');
        $(btn_place_order).submit();
      }
    });

    function validate(data){
      if(data != "" && data != null && data != undefined)
        return true;
      else
        return false;
    }


});