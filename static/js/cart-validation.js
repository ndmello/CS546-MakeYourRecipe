(function ($) {
    $("input").on("change paste keyup", function() {
        validateInput($(this).val());
    });
        
    function validateInput(value) {
        if (value == null | value == undefined || isNaN(value) || value === "") {
            throw "Invalid: not a number";
        } else if (value < 0) {
            throw "Invalid: number below zero";
        }
    }
})(jQuery);