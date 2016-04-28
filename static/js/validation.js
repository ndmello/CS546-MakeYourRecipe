

$(document).ready(function() {
   

   var inputtext = $("#search-box");
   var searchbutton = $("#search-btn");

   $(searchbutton).click(function(e){
   	if(inputtext.val() == "" || inputtext.val() == null || inputtext.val() == undefined)
   	{
   		e.preventDefault();
   	}
   });

    
});
