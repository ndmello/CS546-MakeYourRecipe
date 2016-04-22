(function ($) {
    $("input").on("change paste keyup", function() {
        updateCartPrice();
    });
    
    updateCartPrice();
        
    function updateCartPrice() {
        var cartTotal = 0;
        
        $("tbody > tr").each(function () {
            var recipeTotal = 0.0;
            var ingredientList = $(this).find("ul");

            ingredientList.children("li").each(function () {
                var count = $(this).find("input").val();
                var price = $(this).find(".price").text();
                recipeTotal += count * price;
            });
            cartTotal += recipeTotal;
            recipeTotal = parseFloat(recipeTotal).toFixed(2);
            $(this).find(".recipe-price").text("$" + recipeTotal);
        });

        cartTotal = parseFloat(cartTotal).toFixed(2);
        $(".cart-price").text("$" + cartTotal);
    };
})(jQuery);