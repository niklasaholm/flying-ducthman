// This button will increase the number of beers (no max at the moment)
$(document).on('click touchstart', '.btn-plus', function(e){
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
$(document).on('click touchstart', '.btn-minus', function(e){
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

var oldList=[];
var newList=[];

var shoppingcartList = []; //Global variable used to keep track of the ordered beers.
var total=0; //keeps track of the total.

//Makes the dropzone droppable by preventing default behaviour.
$(document).on("dragover","#shoppingcart",function(e){
    e.preventDefault();
});



//Changes the opacity of an element 
function changeOpacity(item, val){
    item.css("opacity",val);
}

/*Handles the drag of the tray with the beers. Animates a change of 
color as a visual hint of where the dropzone is located. */
$(document).on("dragstart",".dragMe",function(e){
    e.originalEvent.dataTransfer.setData("Text",e.target.id);
    changeOpacity($("#beerList"),"0.4");
    changeOpacity($(".main"),"0.4");
    $("#shoppingcart").css("background","#cbcbcb");
  });


//Handles the drop of beers. 
$(document).on("drop","#shoppingcart",function(e){
    e.preventDefault();
    var id=e.originalEvent.dataTransfer.getData("Text");
    //var name=$('#'+id+".dragMe").attr('name');
    var price=$('#'+id+".dragMe").attr('price');
    var quant=$('#'+id+".dragMe").attr('quant');

    addToCart(id,price,quant);
    //clears the redo function
    $("#redo").attr("disabled",true)
    newList.length = 0;
    //removes the hint (only done once)
    $("#hintToRemove").remove();
});

$(document).on("click touchstart","#addToCartSmallScreen",function(e){
    var id = $(".dragMe").attr("id");
    console.log(id);
    var price=$('#'+id+".dragMe").attr('price');
    var quant=$('#'+id+".dragMe").attr('quant');

    addToCart(id,price,quant);
    //clears the redo function
    $("#redo").attr("disabled",true)
    newList.length = 0;
    //removes the hint (only done once)
    $("#hintToRemove").remove();
});

$(document).on("dragend",".dragMe",function(e){
    changeOpacity($("#beerList"),"1");
    changeOpacity($(".main"),"1");
    $("#shoppingcart").css("background","#f5f5f5");
    //$("#shoppingcart").css("border","none");
});

function newToCart(id,price,quant){
    var item = $('.beeritem#'+id).parent().clone( true );
    item.find("#"+id).attr("class","cartitem");
    item.find("#"+id).attr("id","Beer"+id);
    var itemToChange=item.find(".price");
    itemToChange.text(quant+" x "+price+" £ = " + (quant*price).toFixed(2)+" £");
    itemToChange.attr("q",quant);
    itemToChange.attr("p",price);
    $(".shopping-cart-item").append(item);
    shoppingcartList.push("Beer"+id);
    total+=1*(quant*price);
    $("#TOTAL").text("Total: "+total.toFixed(2)+ " £");
    $("#"+id).focus();
}

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
    $("#TOTAL").text("Total: "+total.toFixed(2)+ " £");
    item.focus();
}

//add a beer to the cart. Sets its price and quantity. 
function addToCart(id,price,quant){
    oldList.push({"id":id,"price":price,"quant":quant});
    $("#undo").attr("disabled",false);
    $("#buy").attr("disabled",false);
    if ($.inArray("Beer"+id,shoppingcartList)>-1){
        item=$("#Beer"+id);
        updateCart(item,quant);
    }else{
        newToCart(id,price,quant);
    }
}

//deletes an item from cart
function deleteFromCart(item){
    item.remove();
    shoppingcartList.pop();
}

//removes the specified amout of a beer item from cart. 
//deletes it if 0.
function removeFromCart(id, price, quant){
    item=$("#Beer"+id);
    itemQuant=item.find(".price").attr("q");
    console.log(itemQuant)
    if (1*itemQuant - 1*quant <=0){
        total+=-(1*(quant*price));
        $("#TOTAL").text("Total: "+total.toFixed(2)+ " £");
        deleteFromCart(item);
    }else{
        updateCart(item, -(1*quant));
    }
}

function undo(){
    $("#redo").attr("disabled",false)
    undoItem = oldList.pop();
    if(oldList.length==0){
        $("#undo").attr("disabled",true)
        $("#buy").attr("disabled",true)
    }
    newList.push(undoItem);
    removeFromCart(undoItem.id, undoItem.price, undoItem.quant);
}

function redo(){ 
    redoItem = newList.pop();
    if(newList.length==0){
    $("#redo").attr("disabled",true)
    }
    addToCart(redoItem.id, redoItem.price, redoItem.quant);
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

function beforeBuy(){
    $("#buyList").html("");
    $("#withdrawFromBalance").html("");
    $("#newBalance").html("");
    $("#buyList").html($(".shopping-cart-item").clone());
    $("#totalBuyList").html($("#TOTAL").clone());
    if($("#userBalance").text()!=""){
        $("#finalizeTransac").attr("disabled",false);
        var balance= $("#userBalance").html();
        $("#withdrawFromBalance").html("Balance: "+balance+ " £");

        $("#newBalance").html("New Balance: "+ (1*balance-1*total) +" £");
    }else{
        $("#finalizeTransac").attr("disabled",true);
        $("#withdrawFromBalance").html("Please login to continue...");
    }

}






