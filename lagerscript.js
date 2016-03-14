/**
 * Created by martin on 2016-02-17.
 */

var bevDict = {};

//console.log(bevDict);

$(document).ready(function(){
    console.log("LOOOOOOOOOAAAAAAAAAAAAAAAAAAAAAAAAAAAD");
    getInventoryForInventory();
});


$(document).on('click', '#checkDiv', function(){
    $( '#emptyCheck' ).change(function(){
        if (this.checked){
            $( '.notEmpty' ).hide();
            $( '.divchar td').hide();
        } else {
            $( '.notEmpty' ).show();
            $( '.divchar td').show();
        }
    });
});


$(function() {
    function updateStock(id, numberOfBevs){
        var bevTuple = bevDict[id];
        var oldAmount = bevTuple[0];
        var price = bevTuple[1];
        var newAmount = oldAmount - numberOfBevs;

        var buy_json;
        var buy_url="http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass" +
            "&action=inventory_append&beer_id="+id.toString()+
            ",amount="+newAmount.toString()+",price="+price.toString();
        /*
    alert("http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass" +
        "&action=inventory_append&beer_id="+id+",amount="+newAmount+",price="+price);
    */
        $.getJSON(buy_url, function(json){
            buy_json = json;
            console.log(buy_json.payload[0]);

            bevDict[id] = [newAmount, price];            // Update dict with new amount

            updateInventoryFoReal(id);
        });
    }
    window.updateStock = updateStock;
});

var beers = new Array();

function getInventoryForInventory(){
    var my_json;
    var my_url="http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=inventory_get";
    //var isEmpty = $.isEmptyObject(bevDict);
    $.getJSON(my_url, function(json) {
        my_json = json;
        console.log(my_json.payload[0]);
        /*var beers=[];
                 for(i = 0; i < my_json.payload.length; i++){
                 beers.push(my_json.payload[i].namn);
                 }*/
        beers=my_json.payload;
        console.log(beers);


        var list = '<ul id="beers" class="nav nav-sidebar">';
        var changeTableNum = Math.floor((beers.length/2));
        var changeIndex = 0;
        var currentTable = 0;
        var currentChar = '.';
        var numOfNameless = 0;
        var backgroundcolor = ["#DCE0F0", "#A6A9B5"];

        for (var i = 0; i < beers.length; i++) { // Each sub-entry
            if (beers[i].namn==""){
                numOfNameless++;
                continue;
            }
            //newBeers = "<tr> <td>beersnamn</td> <td>beerscount</td></tr>";
            var beerCount;
            var emptyOrNot;
            if ((beers[i].count) < 1){
                beerCount = '<td style="color: red" class="beerCount">'+beers[i].count+'</td>';
                emptyOrNot = "empty";
            }else{
                beerCount = '<td class="beerCount">'+beers[i].count+'</td>';
                emptyOrNot = "notEmpty";
            }
            colNum = (changeIndex%2);
            newBeers = '<tr class="tRow '+emptyOrNot+'" id="'+beers[i].beer_id+'" style="background-color: '+backgroundcolor[colNum]+'"> ' +
                '<td class="beerName">'+beers[i].namn+'</td>'+beerCount+ '</tr>';

            bevDict[beers[i].beer_id] = [beers[i].count, beers[i].sbl_price];

            if ((changeIndex+numOfNameless) == changeTableNum){
                currentTable++;
                changeIndex = 0;
            }

            changeIndex++;
            $(newBeers).appendTo($("#lager"+currentTable));
            var charOfCurrentBeer = (beers[i].namn).substring(0,1);
            if (charOfCurrentBeer !== currentChar && currentTable < 2) {
                $('<tr><td>'+charOfCurrentBeer+'</td></tr>').appendTo($("#chars"+currentTable));
                currentChar = charOfCurrentBeer;
            }else{
                $('<tr> <td></td></tr>').appendTo($("#chars"+currentTable));
            }

            //list += '<tr id="beers[i].beer_id"> <td>beers[i].namn</td> <td>beers[i].count</td></tr>';
        }
        //list += '</ul>';
        //$('#beers').append(list);
    });
}

function updateInventoryFoReal(id) {
    $(".tRow").each(function() {
        var cell = $(this).find(".beerCount");
        var id = $(this).attr("id");
        var bevTup = bevDict[id];
        var newAmount = bevTup[0];

        if (newAmount < 1) {
            $(this).attr("class", "tRow empty");
            $(this).css("color", "red");
        }else{
            $(this).attr("class", "tRow notEmpty");
        }
        $(cell).html(newAmount);
    });
}
