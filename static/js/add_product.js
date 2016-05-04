(function ($) {
    $("#button-buy").on("click", function() {
        var recipe = {};
        recipe["recipeId"] = $("#recipe-guid").data("guid");

        $(".ingredient-info").each(function() {
            recipe[$(this).data("guid")] = $(this).siblings(".input-quantity").val()
        });
        
        $.ajax({
            url: "/cart/add",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(recipe)
        });
    });
})(jQuery);