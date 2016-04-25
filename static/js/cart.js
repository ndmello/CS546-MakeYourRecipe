(function ($) {
    updateCartPrice();
    orderAllLists();
    
    //$("input").on("change paste keyup", function() {
    $("input").on("change paste", function() {
        updateCartPrice();
    });
    
    $(".btn-remove").on("click", function() {
        var parent = $(this).parent();
        parent.addClass("removed");
        $(this).addClass("hide");
        
        var input = $(this).parent().find("input");
        input.addClass("hide");
        
        parent.find(".btn-add").removeClass("hide");
        
        $(this).closest("li").addClass("removed");
        orderList($(this).closest("ul"));
        
        updateCartPrice();
    });
    
    $(".btn-add").on("click", function() {
        var parent = $(this).parent();
        parent.removeClass("removed");
        $(this).addClass("hide");
        
        var input = $(this).parent().find("input");
        input.removeClass("hide");
        
        parent.find(".btn-remove").removeClass("hide");
        
        $(this).closest("li").removeClass("removed");
        orderList($(this).closest("ul"));
        
        updateCartPrice();
    });
        
    function updateCartPrice() {
        var cartTotal = 0;
        
        $("tbody > tr").each(function () {
            var recipeTotal = 0.0;
            var ingredientList = $(this).find("ul");

            ingredientList.children("li").each(function () {
                var form = $(this).find(".form-inline");
                var count = $(this).hasClass("removed") ? 0 : $(this).find("input").val();
                var price = $(this).find(".price").text();
                
                if (validateInput(form, count)) {
                    removeError(form);
                    recipeTotal += count * price;
                }
            });
            cartTotal += recipeTotal;
            recipeTotal = parseFloat(recipeTotal).toFixed(2);
            $(this).find(".recipe-price").text("$" + recipeTotal);
        });

        cartTotal = parseFloat(cartTotal).toFixed(2);
        $(".cart-price").text("$" + cartTotal);
    }
    
    function validateInput(form, value) {
        if (value == null | value == undefined || isNaN(value) || value === "") {
            addError(form, "Invalid: not a number");
            return false;
        } else if (value < 0) {
            addError(form, "Invalid: number below zero");
            return false;
        }
        
        return true;
    }
    
    function addError(element, error) {
        removeError(element); // remove previous error
        element.addClass("has-error");
        var error = $("<span class=\"help-block\"></span>").text(error);
        element.append(error);
    }
    
    function removeError(element) {
        element.find($(".help-block")).remove();
        element.removeClass("has-error");
    }
    
    function orderAllLists() {
        $("ul").each(function () {
            orderList($(this));
        });
    }
    
    function orderList(list) {
        list.children("li").each(function () {
            if (!$(this).hasClass("removed")) {
                list.prepend($(this));
            }
        });
    }
    
})(jQuery);