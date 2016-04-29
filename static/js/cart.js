(function ($) {
    updateCartPrice();
    orderAllLists();
    
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
        var cart = getCart();
        console.log(JSON.stringify(cart))
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
                console.log("found an error");
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
        //removeError(element); // remove previous error
        element.addClass("has-error");
        //var error = $("<span class=\"col-sm-offset-3 col-sm-9 help-block\"><br /></span>").text(error);
        var help = element.find($(".help-block"));
        help.text(error);
        help.removeClass("hidden");
        //element.append(error);
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
    
    function getCart() {
        /*var save = $("#checkout-row");
        if (!validateAllInput()) {
            addError(save, "Please fix errors in cart before proceeding");
            return;
        }
        removeError(save);*/
        
        var cartId = $("main").attr("id");
        var userId = $("table").attr("id");
        var recipes = [];
        
        $("ul").each(function () {
            if (!$(this).hasClass("removed")) {
                var recipeId = $(this).attr("id");
                var ingredients = [];
                
                $(this).find("li").each(function () {
                    if (!$(this).hasClass("removed")) {
                        var input = $(this).find("input");
                        var ingredientId = input.attr("id");
                        var quantity = input.val();
                        
                        if (quantity > 0) {
                            var ingredient = {
                                "ingredientId": ingredientId,
                                "quantity": quantity
                            };
                            ingredients.push(ingredient);
                        }
                    }
                });
               if (ingredients.length > 0) {
                   var recipe = {
                       "recipeId": recipeId,
                       "ingredients": ingredients
                   };
                   recipes.push(recipe);
               }
            }
        });
        if (recipes.length > 0) {
            var cart = {
                "_id": cartId,
                "userId": userId,
                "recipes": recipes
            };
            return cart;
        }
        return null;
    }
})(jQuery);