/**
 * Created by martin on 2016-02-17.
 */

var bevDict = {};

bevDict['key'] = ["testing1", "testing2"];

console.log(bevDict);

$(document).ready(function() {
   getInventory();
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

$(document).on('click', '.buyBev', function(){
    var clickedBevId = this.getAttribute("data-id");
    updateStock(clickedBevId, 1);
});

$(document).on('click', '.addBev', function(){
    var clickedBevId = this.getAttribute("data-id");
    updateStock(clickedBevId, -1);
});

//var blackTowerId = 604504;

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
    });

    bevDict[id] = [newAmount, price];            // Update dict with new amount

    var tableRow = document.getElementById(id);  //
    var cells = tableRow.cells;                  //  Update table
    cells[1].innerHTML = newAmount;              //  TODO: if amount < 1 change class

}

function getInventory(){
    var my_json;
    var my_url="http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=inventory_get";
    $.getJSON(my_url, function(json) {
        my_json = json;
        console.log(my_json.payload[0]);
        /*var beers=[];
        for(i = 0; i < my_json.payload.length; i++){
            beers.push(my_json.payload[i].namn);
        }*/
        beers=my_json.payload;
        //var list = '<ul id="beers" class="nav nav-sidebar">';
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
                emptyOrNot = 'class="empty"';
            }else{
                beerCount = '<td class="beerCount">'+beers[i].count+'</td>';
                emptyOrNot = 'class="notEmpty"';
            }
            colNum = (changeIndex%2);
            newBeers = '<tr '+emptyOrNot+'id="'+beers[i].beer_id+'" style="background-color: '+backgroundcolor[colNum]+'"> ' +
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
