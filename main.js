function getInventory(drinks, drinksInfo){
  $('#beerList').empty();
  var beers = '<h4 id="beers">Beers</h4><ul class="nav nav-sidebar">';
  var wines = '<h4 id="wines">Wines</h4><ul class="nav nav-sidebar">';
  var cider = '<h4 id="ciders">Ciders</h4><ul class="nav nav-sidebar">';
  var noneAlc = '<h4 id="nonalc">Non-Alcoholic</h4><ul class="nav nav-sidebar">';

  for (var i = 0; i < drinksInfo.length; i++) { // Each sub-entry
    beers += sortBeverages(drinks[i],drinksInfo[i],"Ö");
    wines += sortBeverages(drinks[i],drinksInfo[i],"V");
    wines += sortBeverages(drinks[i],drinksInfo[i],"R");
    cider += sortBeverages(drinks[i],drinksInfo[i],"C");
    noneAlc += sortBeverages(drinks[i],drinksInfo[i],"A");
  }
  beers += '</ul>';
  wines += '</ul>';
  cider += '</ul>';
  noneAlc += '</ul>';
  $('#beerList').append(beers);
  $('#beerList').append(wines);
  $('#beerList').append(cider);
  $('#beerList').append(noneAlc);

  for (var i = 0; i < drinksInfo.length; i++) {
    outOfStock(drinks[i], drinksInfo[i]);
    isBio(drinks[i], drinksInfo[i]);
  }
}

function sortBeverages(b,info,type){
  if (info.varugrupp[0]==type){
      return '<li><a id="'+b.beer_id+'" class="beeritem"><div>'+b.namn+'</div><div class="price" q="" p="">'+info.prisinklmoms+'£</div></a></li>';
    }else{
      return "";
    }
}

function outOfStock(b, info){
      div=$("#"+b.beer_id);
  if (b.count<=0){
      div.css("background","url('Pictures/Sold-Out.png') no-repeat ");
      div.css("background-size","100px 60px");
      div.css("background-position","95% 50%");
      div.find(".price").attr("q",-1);
  } else {
    div.find(".price").attr("q",1);
    isBio(b,info);
  }
}

function isBio(b,info){
  //console.log(b)
  if (info.ekologisk==1){
      div=$("#"+b.beer_id)
      div.css("background","url('Pictures/eco.png') no-repeat");
      div.css("background-size","36px 22px");
      div.css("background-position","85% 50%");
  }
}

function getPayementInfo(userID){
  var my_json;
  var my_url="http://pub.jamaica-inn.net/fpdb/api.php?username="+userID+"&password="+userID+"&action=payments_get";
    $.getJSON(my_url, function(json) {
  my_json = json;
  transaction=my_json.payload;
  var list = '<ul class="nav nav-sidebar">';
  for(var t = 0; t < transaction.length;t++){
  list+='<li><a><div>Nr: '+transaction[t].transaction_id+'</div><div>Date: '+transaction[t].timestamp.substring(0,10)+'<span class="spanRight">Time: '+transaction[t].timestamp.substring(11,transaction[t].timestamp.length)+'</span></div><div>Total: '+transaction[t].amount+'</div></a></li>';
  }
  list+='</ul>'; 
  $("#payementList").append(list); 
  });
}

function getBeerInfo(id){
var my_json;
var my_url="http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=beer_data_get&beer_id="+id;
    $.getJSON(my_url, function(json) {
  my_json = json;
  //console.log(my_json.payload[0]);
  beer=my_json.payload[0];
  //console.log(beer.alkoholhalt);
  $('.page-header').text(beer.namn);
  $('#p1').text(beer.prisinklmoms);
  $('#p2').text(beer.alkoholhalt);
  $('#p3').text(beer.ursprunglandnamn);
  $('#p4').text(beer.varugrupp);
  $(".dragMe").attr('name',beer.namn);
  $(".dragMe").attr('price',beer.prisinklmoms);
});
}

//Checks if a user is logged in or not 
function checkLogin(){
  var customer=getCookie("username");
  var type=getCookie("type");
  //console.log(customer);
  if (customer!="") {
    console.log(type);
    if(type=="Admin"){
      $(".admin").show();
    }else{
      $(".admin").hide();
    }
    $("#userType").text(type);
    $("#userType").append('<span class="glyphicon glyphicon-menu-hamburger spanRight"></span>');
    $("#userName").text(customer);
    $("#userBalance").text(getCookie("balance"));
    $("#inout").text("Sign Out");
    $("#inout").attr("status","IN");
    $(".hide-if-out").show();
    
    getPayementInfo(customer);
  }else{
    $(".admin").show(); //CHANGE BACK to hide()
    $("#userType").text("Guest");
    $("#userName").text("");
    $("#userBalance").text("");
    $(".hide-if-out").hide();
  }
}

$(document).ready(function(){
  getInventory(beerInfoList, beerInfoList2);
  checkLogin();
  console.log("Page Loaded");
});

$(document).on('click touchstart', '#inout', function () {
    if($("#inout").attr("status")=="IN"){
    setCookie("username","",-1);
    $("#inout").text("Sign In");
    $("#userType").text("");
    $("#userBalance").text("");
    $(".hide-if-out").hide();
    window.location.reload();
    }else{
      //$('#loginModal').modal('toogle');
      //window.location.href=("signin.html");
    }
});

$(document).on('click touchstart', '.beeritem', function () {
  console.log($(document).width());
    if($(document).width()<768){
      $("#beerList").collapse("hide");
      $(".dragMe").hide();
      $("#addToCartSmallScreen").show();
    }else{
    $(".dragMe").show();
    $("#addToCartSmallScreen").hide();
  }
    getBeerInfo(this.id);
    if($(this).find(".price").attr("q")<0){
      drawBeer(0);
      $(".input-number").val("Sold Out");
      $(".dragMe").attr( 'draggable', 'false' );
      $(".main").show();
      $(".btn-plus").attr('disabled', true);
      $(".btn-minus").attr('disabled', true);
    }else{
    drawBeer(1);
    $(".btn-plus").attr('disabled', false);
    $(".main").show();
    $(".input-number").val(1);
    $(".dragMe").attr( 'draggable', 'true' );
    $(".dragMe").attr('id',this.id);
    $(".dragMe").attr('quant',$(".input-number").val());
  }
});

$(document).on('click', '#inventoryButton', function () {
  //$("#ilagerframe").attr("src", $("#ilagerframe").attr("src"));
  //$( '#ilagerframe' ).attr( 'src', function ( i, val ) { return val; });
  //var frame = document.getElementById("ilagerframe");
  //var firstTable = frame.contentWindow.document.getElementsByTagName("table")[0];
  //var tableNode = document.importNode(firstTable, true);
  //updateInventoryFoReal(firstTable);
  $("#inventoryModal").modal({show:true});
});







