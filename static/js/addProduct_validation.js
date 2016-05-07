function extractAddProductForm(recipe_name, description, image_url, prep_time, cook_time, servings, procedure, ingredient_name, min_quantity, price) {
		// first, we check if there are values
		if (recipe_name == '' || description == '' || image_url == '' || prep_time == '' || cook_time == '' || servings == '' || procedure == '' || ingredient_name == '' || min_quantity == '' || price == '') {
			throw "Please fill all the fields.";
			} 
}
$("#add-product-form").submit(function(event) {
						
			var recipe_name = $("#recipe_name").val();
			var description = $("#description").val();		
			var image_url = $("#image_url").val();
			var prep_time = $("#prep_time").val();
			var cook_time = $("#cook_time").val();		
			var servings = $("#servings").val();
			
			var procedure = $("#procedure").val();
			var ingredient_name = $("#ingredient_name").val();		
			var min_quantity = $("#min_quantity").val();
			
			var price = $("#price").val();
			
			var errorAlert = $("#error-message");
			
					
			try {
				var numbers = extractAddProductForm(recipe_name, description, image_url, prep_time, cook_time, servings, procedure, ingredient_name, min_quantity, price);
				errorAlert.addClass('hidden');
				$("add-product-form").submit();

			} catch (error) {
				errorAlert.removeClass('hidden');
				errorAlert.text(error);
				event.preventDefault();
			}
			
});