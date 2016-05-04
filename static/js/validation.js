

$(document).ready(function() {
   

   var inputtext = $("#search-box");
   var searchbutton = $("#search-btn");

   $(searchbutton).click(function(e){
   	if(inputtext.val() == "" || inputtext.val() == null || inputtext.val() == undefined)
   	{
   		e.preventDefault();
   	}
   });
// product page validation

var quantity = $('input[id^="quantity"]');
var buy_btn = $("#buy"); 
var price = $('input[id^="price"]');
var total_price = $("#total");

// $(buy_btn).click(function(e){
// 	if(quantity.val() < 0 && quantity.val() > 100){
// 		e.preventDefault();
// 	}
// });

var i=0;
var arr_price = [];
var total=0;
$(price).each(function(index,value) {
arr_price[i++]=value.value;
total = total + Number(value.value);
});
total_price.val(total.toFixed(2));

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
   console.log(total.toFixed(2));
   total_price.val(total.toFixed(2));
});

});