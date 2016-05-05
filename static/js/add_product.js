(function($) {
    $("#button-buy").on("click", function() {
        var recipe = {};
        recipe["recipeId"] = $("#recipe-guid").data("guid");

        $(".ingredient-info").each(function() {
            recipe[$(this).data("guid")] = $(this).find(".input-quantity").val();
        });
        
        console.log(recipe);
       
        var recipeConfig = {
            method: "POST",
            url: "/cart/add",
            contentType: 'application/json',
            data: JSON.stringify(recipe)
        }

        $.ajax(recipeConfig);
    });
})(window.jQuery);