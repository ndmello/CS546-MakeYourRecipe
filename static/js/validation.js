

$(document).ready(function() {
   
   var inputtext = $("#search-box");
   var searchbutton = $("#search-btn");

   $(searchbutton).click(function(e){
   	if(inputtext.val() == "" || inputtext.val() == null || inputtext.val() == undefined)
   	{
   		e.preventDefault();
   	}
   });

//
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

});