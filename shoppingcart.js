// This button will increase the number of beers (no max at the moment)
$(document).on('click', '.btn-plus', function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If is not undefined
        if (currentVal>0){
        if (!isNaN(currentVal)) {
            // Increment
            $('input[name='+fieldName+']').val(currentVal + 1);
            $(".btn-minus").attr('disabled', false);
            drawBeer($('input[name='+fieldName+']').val());
            $(".dragMe").attr('quant',$('input[name='+fieldName+']').val())
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
        }
        }
    });
// This button will decrease the number of beers until 1
$(document).on('click', '.btn-minus', function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (currentVal>0){
        if (!isNaN(currentVal) && currentVal > 1) {
            // Decrement one
            $('input[name='+fieldName+']').val(currentVal - 1);
            drawBeer($('input[name='+fieldName+']').val());
            $(".dragMe").attr('quant',$('input[name='+fieldName+']').val())
            if(currentVal-1<=1){
                $(this).attr('disabled', true);
            }
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
            $(this).attr('disabled', true);
        }
    }
});
 
var shoppingcartList = []; //Global variable used to keep track of the ordered beers.
var total=0; //keeps track of the total.

//Makes the dropzone droppable by preventing default behaviour.
$(document).on("dragover","#shoppingcart",function(e){
    e.preventDefault();
  });

/*Handles the drag of the tray with the beers. Animates a change of 
color as a visual hint of where the dropzone is located. */
$(document).on("dragstart",".dragMe",function(e){
    e.originalEvent.dataTransfer.setData("Text",e.target.id);
    $("#beerList").css("opacity","0.4");
    $(".main").css("opacity","0.4");
    $("#shoppingcart").css("background","#cbcbcb");
  });

//Handles the drop of beers. 
$(document).on("drop","#shoppingcart",function(e){
    e.preventDefault();
    var id=e.originalEvent.dataTransfer.getData("Text");
    var name=$('#'+id+".dragMe").attr('name');
    var price=$('#'+id+".dragMe").attr('price');
    var quant=$('#'+id+".dragMe").attr('quant');

    if ($.inArray(name[0]+""+id,shoppingcartList)>-1){
        item=$("#"+name[0]+""+id);
        updateCart(item,quant);
    }else{
        addToCart(id,name,price,quant);
    }
    //removes the hint (only done once)
    $("#hintToRemove").remove();
});

$(document).on("dragend",".dragMe",function(e){
    $("#beerList").css("opacity","1");
    $(".main").css("opacity","1");
    $("#shoppingcart").css("background","#f5f5f5");
    //$("#shoppingcart").css("border","none");
});

//When a beer that is already in the cart is dropped, 
//the quantity is increased and the price is updated. 
function updateCart(item, quant){
    itemToChange=item.find(".price");
    console.log(itemToChange);
    q=itemToChange.attr("q");
    price=itemToChange.attr("p");
    var newQ=1*q+1*quant
    itemToChange.attr("q",newQ);
    itemToChange.text((newQ)+" x "+price+" £ = " + (newQ*price).toFixed(2)+" £");
    total+=1*(quant*price);
    $(".total > h4").text("Total: "+total.toFixed(2)+ " £");
    $("#"+id).focus();
}

//add a beer to the cart. Sets its price and quantity. 
function addToCart(id,name,price,quant){
    var item = $('.beeritem#'+id).parent().clone( true );
    item.find("#"+id).attr("class","cartitem");
    item.find("#"+id).attr("id",name[0]+""+id);
    var itemToChange=item.find(".price");
    itemToChange.text(quant+" x "+price+" £ = " + (quant*price).toFixed(2)+" £");
    itemToChange.attr("q",quant);
    itemToChange.attr("p",price);
    $(".shopping-cart-item").append(item);
    shoppingcartList.push(name[0]+""+id);
    total+=1*(quant*price);
    $(".total > h4").text("Total: "+total.toFixed(2)+ " £");
    $("#"+id).focus();
}



//draw on canvas for nice animations
function drawBeer(x){
var myCanvas = document.getElementById('canvas');
var ctx = myCanvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
var img = new Image;
img.src ="Pictures/beer.png";
for (i=0;i<x;i++){
ctx.drawImage(img,i*25,0, 75, 75 * img.height / img.width);
}
}






