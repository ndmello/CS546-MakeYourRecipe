(function ($) {
    updateCartPrice();
    orderAllLists();
    hideNoQuantity();
    
    $("input").on("change paste keyup", function() {
        updateCartPrice();
    });
    
    $(".btn-remove-ingredient").on("click", function() {
        removeIngredient($(this).closest("li"), $(this).closest("li").find(".btn-add-ingredient"), $(this));
    });
    
    $(".btn-add-ingredient").on("click", function () {
        addIngredient($(this).closest("li"), $(this), $(this).closest("li").find(".btn-remove-ingredient"));
    });
    
    $(".btn-remove-recipe").on("click", function () {
        var data = $(this).closest("td");
        data.find("h3").addClass("removed");
        data.find("ul").addClass("removed");
        
        $(this).addClass("hidden");
        data.find(".btn-add-recipe").removeClass("hidden");
        
        data.find("ul").addClass("hidden");
        updateCartPrice();
        orderAllLists();
    });
    
    $(".btn-add-recipe").on("click", function () {
        var data = $(this).closest("td");
        data.find("h3").removeClass("removed");
        data.find("ul").removeClass("removed");
        
        $(this).addClass("hidden");
        data.find(".btn-remove-recipe").removeClass("hidden");
        
        data.find("ul").removeClass("hidden");
        updateCartPrice();
        orderAllLists();
    });
    
    $("#btn-save-cart").on("click", function() {
        saveCart();
    });
        
    function updateCartPrice() {
        validateAllInput();
        var cartTotal = 0;
        
        $("tbody > tr").each(function () {
            var recipeTotal = 0.0;
            var ingredientList = $(this).find("ul");

            if (!ingredientList.hasClass("removed")) {
                ingredientList.find("li").each(function () {
                    var count = $(this).hasClass("removed") ? 0 : $(this).find("input").val();
                    var price = $(this).find(".price").text();
                    
                    if (validateInput($(this), count)) {
                        removeError($(this));
                        recipeTotal += count * price;
                    }
                });
            }
            cartTotal += recipeTotal;
            recipeTotal = parseFloat(recipeTotal).toFixed(2);
            $(this).find(".recipe-price").text("$" + recipeTotal);
        });

        cartTotal = parseFloat(cartTotal).toFixed(2);
        $(".cart-price").text("$" + cartTotal);
    }
    
    function validateAllInput() {
        var errors = false;
        $("li").each(function () {
            var inputItem = $(this).find(".cart-input");
            if (inputItem.is("input") && !validateInput($(this), inputItem.val())) {
                errors = true;
            }
        });
        
        var save = $("#checkout-row");
        if (errors) {
            addError(save, "Please fix errors in cart before proceeding");
            save.find("button").each(function () {
                $(this).prop("disabled", true);
            });
        } else {
            removeError(save);
            save.find("button").each(function () {
                $(this).prop("disabled", false);
            });
        }
        return !errors;
    }
    
    function validateInput(form, value) {
        if (/*value == null | value == undefined || */isNaN(value) || value === "") {
            addError(form, "Invalid: not a number");
            return false;
        } else if (value < 0) {
            addError(form, "Invalid: quantity below zero");
            return false;
        }
        
        return true;
    }
    
    function addError(element, error) {
        element.addClass("has-error");
        var help = element.find($(".help-block"));
        help.text(error);
        help.removeClass("hidden");
    }
    
    function removeError(element) {
        element.find($(".help-block")).addClass("hidden");
        element.removeClass("has-error");
    }
    
    function orderAllLists() {
        $("ul").each(function () {
            if ($(this).hasClass("removed")) {
                orderList($(this));
                $(this).closest("tbody").append($(this).closest("tr"));
            }
        });
    }
    
    function orderList(list) {
        list.find("li").each(function () {
            if ($(this).hasClass("removed")) {
                $(this).closest("div").append($(this));
            }
        });
    }
        
    function removeIngredient (listItem, addBtn, removeBtn) {
        listItem.addClass("removed");
        removeBtn.addClass("hidden");

        listItem.find("input").addClass("hidden");
        addBtn.removeClass("hidden");
        
        orderList(listItem.closest("ul"));
        updateCartPrice();
    }
    
    function addIngredient (listItem, addBtn, removeBtn) {
        listItem.removeClass("removed");
        addBtn.addClass("hidden");

        listItem.find("input").removeClass("hidden");
        removeBtn.removeClass("hidden");
              
        orderList(listItem.closest("ul"));
        updateCartPrice();
    }
    
    function hideNoQuantity() {
        $("li").each(function() {
            if ($(this).find("input").val() == 0) {
                removeIngredient($(this), $(this).find(".btn-add-ingredient"), $(this).find(".btn-remove-ingredient"));
            }
        });
    }
    
    function getCart() {
        
        var cartId = $("main").attr("id");
        var recipes = [];
        
        $("ul").each(function () {
            if (!$(this).hasClass("removed")) {
                var recipe = {};
                var empty = true;
                recipe["recipeId"] = $(this).attr("id");
                
                $(this).find("li").each(function () {
                    var input = $(this).find("input");
                    var ingredientId = input.attr("id");
                    var quantity = $(this).hasClass("removed") ? 0 : input.val();
                    
                    if (quantity > 0) {
                        recipe[ingredientId] = quantity;
                        empty = false;
                    }
                });
               if (!empty) {
                   recipes.push(recipe);
               }
            }
        });
        return {
            "_id": cartId,
            "recipes": recipes
        };
    }
    
    function saveCart() {
        $.ajax({
            url: "/cart/save",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(getCart())
        });
    }
})(jQuery);