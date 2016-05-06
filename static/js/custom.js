
function pop(div) {
	document.getElementById(div).style.display = 'block';
}
function hide(div) {
	document.getElementById(div).style.display = 'none';
}
			//To detect escape button
			document.onkeydown = function(evt) {
				evt = evt || window.event;
				if (evt.keyCode == 27) {
					hide('popDiv');
				}
			};

$(document).ready(function() {
   
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
    	e.preventDefault();
    		x++;
            $(wrapper).append('<div style="margin-top:10px"> '+
           	'<label class="col-sm-2 control-label">Ingredient Name</label>'+
	           	'<div class="col-sm-10">'+
	            	'<input type="text" class="form-control" name="i_name[]"/>'+
	            '</div>'+
	        '<label class="col-sm-2 control-label">Minimum Quantity</label>'+
	           	'<div class="col-sm-10">'+
	            	'<input type="text" class="form-control" name="min_q[]"/>'+
	            '</div>'+
	        '<label class="col-sm-2 control-label">Price</label>'+
	           	'<div class="col-sm-10">'+
	            	'<input type="text" class="form-control" name="price[]"/>'+
	            '</div>'+
	        '<label class="col-sm-2 control-label">Unit</label>'+
	           	'<div class="col-sm-10">'+
	            	'<input type="text" class="form-control" name="Unit[]"/>'+
	            '</div>'+
            '<a href="#" class="remove_field col-sm-2" style="float:right">Remove</a>'+
            '</div>'); //add input box
        
    });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
    	e.preventDefault(); $(this).parent('div').remove(); x--;
    })

    $("#add-fav").click(function(event){
     	var recipeID = $(this).data("rid");
     	$(this).addClass("hidden");
     	$("#remove-fav").removeClass("hidden");
 
     	 var addConfig = {
             method: "POST",
             url: "/add/favorite",
             contentType: 'application/json',
             data: JSON.stringify(recipeID)
         }
 
         $.ajax(addConfig).then(function(responseMsg){
             console.log(responseMsg);
          });
 
 
     });	
 
     $("#remove-fav").click(function(event){
     	var recipeID = $(this).data("rid");
     	$(this).addClass("hidden");
     	$("#add-fav").removeClass("hidden");
 
     	var removeConfig = {
             method: "POST",
             url: "/remove/favorite",
             contentType: 'application/json',
             data: JSON.stringify(recipeID)
         }
 
         $.ajax(removeConfig).then(function(responseMsg){
             console.log(responseMsg);
          });
     });	
  });
});
