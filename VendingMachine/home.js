const quarter = 25,
      dime = 10, 
      nickel = 5, 
      penny = 1;
var moneyInserted = 0,
    quarterCount = 0, 
    dimeCount = 0, 
    nickelCount = 0, 
    pennyCount = 0;

$(document).ready(function () {
	
	loadItems();
    
    // Add Dollar click function
    $('#add-dollar').on('click', function() {
        depositMoney(1);
        quarterCount += 4;
    });
    
    // Add Quarter click function
    $('#add-quarter').on('click', function() {
        depositMoney(2);
        quarterCount += 1;
    });
    
    // Add Dime click function
    $('#add-dime').on('click', function() {
        depositMoney(3);
        dimeCount += 1;
    });
    
    // Add Nickel click function
    $('#add-nickel').on('click', function() {
        depositMoney(4);
        nickelCount += 1;
    });
    
    // Clear values click function
    $('#clear').on('click', function() {
        $('#money-inserted').val('');
        $('#messages').val('');
        $('#item').val('');
        $('#change').val('');
        $('#content-rows').empty();
        loadItems();
    });
    
    // Make purchase click function
    $('#make-purchase').on('click', function() {
        var isValidated = fieldsValidation();
        if (isValidated) {
            purchaseItem();
        }
    });
	
    $('#change-return').on('click', function() {
        
        var paymentEntered = $('#money-inserted').val();
            if (paymentEntered > 0) {

                var changeReturn = "Quarters: " + quarterCount + "," + " Dimes: " + dimeCount + "," + " Nickels: " + nickelCount + "," + " Pennies: " + pennyCount;
                $('#change').val(changeReturn);
                $('#messages').val("Your change has been returned.");
               
                $('#money-inserted').val(0);
                quarterCount = 0;
                dimeCount = 0;
                nickelCount = 0;
                moneyInserted = 0;
                $('#item').val("");
                
                
                loadItems();
            }else{
                $('#messages').val("");
                $('#change').val("");
                $('#money-inserted').val(0);
                quarterCount = 0;
                dimeCount = 0;
                nickelCount = 0;
                totalMoneyIn = 0;
                loadItems();
            }
    
        
        
        
    });
})


// Load Items function
function loadItems() {
    $('#content-rows').empty();
	var contentRows = $('#content-rows');
    contentRows.attr({style: 'display:flex; flex-wrap:wrap;'});
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/items',
		success: function(itemArray) {
			$.each(itemArray, function(index, item) {
				var id = item.id;
				var name = item.name;
				var price = item.price;
				var quantity = item.quantity;
				
				var row = '<div class="col-md-4">';
                row += '<button type="button" onclick="selectItem (' + id + ') " class="btn btn-default selection-button">';
                row += '<p class="text-left selection-id">' + id + '</p>';
                row += '<div class="text-center">';
                row += '<p class="snack-name">' + name + '</p>';
                row += '<p class="snack-price">$' + price.toFixed(2) + '</p>';
                row += '<p class="snack-quantity">Quantity Left: ' + quantity + '</p>';
                row += '</div>';
				row += '</button>';
                row += '</div>';
				contentRows.append(row);
                contentRows.append('<p></p>');
				
				
			});
		},
        error: function () {
            displayErrorMessage('#error-messages', 'Web service error. Please try again later.');          
        }
	});
    
}

// Purchase Item function
function purchaseItem() {
    $('#error-messages').empty();
    var string_url = 'http://localhost:8080/money/' + $('#money-inserted').val() + '/item/' + $('#item').val();
    
    $.ajax({
        type: 'GET',
        url: string_url,
        success: function(data, status) {
            $('#messages').val('Thank You!!');
            
            var row = '';
            
            if (data.quarters > 0) {
                row += data.quarters + ' Quarter(s) '
            }
            if (data.dimes > 0) {
                row += data.quarters + ' Dime(s) '
                
            }
            if (data.nickels > 0) {
                row += data.nickels + ' Nickel(s) '
            }
            if (data.pennies > 0) {
                row += data.pennies + ' Penny(s) '
            }
            
            $('#change').val(row);
            $('#content-rows').empty();
            loadItems();
            
        }, 
        error: function(data) {
            var errors = $.parseJSON(data.responseText);
            $.each(errors, function(key, value) {
                $('#messages').val(value);
            });
        }
        
    });
}

// Deposit Money function
function depositMoney(num) {
    var moneyInserted = $('#money-inserted').val();
    
    if (moneyInserted == '') {
        moneyInserted = toCents(0);
    } else {
        moneyInserted = toCents(moneyInserted);
    }
    
    if (num == 1) {
        moneyInserted += 100;
    }
    if (num == 2) {
        moneyInserted += 25;
    }
    if (num == 3) {
        moneyInserted += 10;
    }
    if (num == 4) {
        moneyInserted += 5;
    }
    
    $('#money-inserted').val(toDollars(moneyInserted).toFixed(2));
}

// Fields Validation function
function fieldsValidation() {
    $('#input-1-error-message').empty();
    $('#input-2-error-message').empty();
    
    if ($('#money-inserted').val() == '') {
        displayErrorMessage('#input-1-error-message', 'Field required for puchase.');
        return false;
    } else if ($('#item').val() == '') {
        displayErrorMessage('#input-2-error-message', 'Field required for purchase.');
        return false;
    } else {
        return true;
    }
}

// To Cents function
function toCents(num) {
    return num * 100;
}

// To Dollars function
function toDollars(num) {
    return num / 100;
}

// Display Error Message function
function displayErrorMessage(divId, message) {
    $(divId).empty();
    $(divId)
        .append($('<li>')
            .attr({class: 'list-group-item list-group-item-danger'})
            .text(message));
               
}
// Select Item function
function selectItem(id) {
    $('#messages').val('');
    $('#change').val('');
    $('#item').val(id);
}

function returnChange(moneyInserted) {
    var change = $('#change');
    
    var quarters = Math.floor(moneyInserted / quarter);
    moneyInserted -= quarters * quarter;
    
    var dimes = Math.floor(moneyInserted / dime);
    moneyInserted -= dimes * dime;
    
    var nickels = Math.floor(moneyInserted / nickel);
    moneyInserted -= nickels * nickel;
    
    var pennies = Math.floor(moneyInserted / penny);
    moneyInserted -= pennies * penny;
    
    var returned = "";
    
    if (quarters > 0) {
        returned += quarters + " quarter(s)";
    }
    if (dimes > 0) {
        returned += dimes + " dime(s)";
    }
    if (nickels > 0) {
        returned += nickels + " nickel(s)";
    }
    if (pennies > 0) {
        returned += pennies + " pennies";
    }
    
    change.val(returned);
    
}

