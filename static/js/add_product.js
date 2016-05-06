(function($) {
    var totalInput = $("#total");
    var totalValue =Number(totalInput.val());
    var errorMessage = $("#errorAlert");
    
//on click of buy button 
    $("#button-buy").on("click", function() {
        totalValue =Number(totalInput.val());
        

        if(totalValue !== 0){
            var recipe = {};
            recipe["recipeId"] = $("#recipe-guid").data("guid");

            $(".ingredient-info").each(function() {
                recipe[$(this).data("guid")] = $(this).find(".input-quantity").val();
            });

            var recipeConfig = {
                method: "POST",
                url: "/cart/add",
                contentType: 'application/json',
                data: JSON.stringify(recipe)
            }

            $.ajax(recipeConfig).then(function(responseMsg){
                if(responseMsg.message==="Product added to Cart"){
                    window.location.href="http://localhost:3000/cart";
                }
            });

        }
        else{   
            errorMessage.removeClass('hidden');
            errorMessage.text("Atleast buy one Ingredient");
        }
        
    });

//on change of total
    $(totalInput).change(function(){
        if(totalValue !== 0){
           errorMessage.addClass('hidden'); 
        }

    });

})(window.jQuery);