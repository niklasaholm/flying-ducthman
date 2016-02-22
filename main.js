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
  if (info.ekologisk==1){
      div=$("#"+b.beer_id)
      div.css("background","url('Pictures/eco.png') no-repeat");
      div.css("background-size","36px 22px");
      div.css("background-position","85% 50%");
  }
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
  drawBeer(1);
});
}



$(document).ready(function(){
  getInventory(beerInfoList, beerInfoList2);
  if (getCookie("username")) {
    $("#userAnchor").text(getCookie("username") + " | "+ getCookie("balance"))
  };
  console.log("Page Loaded");
});

/*$(document).on('click', 'a', function () {
    $("a").removeClass("active");
    $(this).addClass("active");
});*/

$(document).on('click', '.beeritem', function () {
    drawBeer(1);
    /*$("a").removeClass("active");
    $(this).addClass("active");
    console.log(this);*/
    getBeerInfo(this.id);
    if($(this).find(".price").attr("q")<0){
      $(".input-number").val("Sold Out");
      $(".dragMe").draggable=false;
      $(".main").show();
      $(".btn-plus").attr('disabled', true);
      $(".btn-minus").attr('disabled', true);
    }else{
    $(".btn-plus").attr('disabled', false);
    $(".main").show();
    $(".input-number").val(1);
    //drawBeer($(".input-number").val());
    $(".dragMe").attr('id',this.id);
    $(".dragMe").attr('quant',$(".input-number").val());
  }
});

function setCookie(key, value) {
  var expires = new Date();
  expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
  document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function filter() {
  eco = document.getElementById("eco").checked;
  kosch = document.getElementById("kosch").checked;
  filterDrinks(eco, kosch);
}

function filterDrinks(eco, kosch) {
  var drinksInfo = [];
  var drinks = [];
  drinksInfo = beerInfoList2.filter(function(item) {
    var state = true;
    if(eco) {
      if(item.ekologisk != 1) { state = false; }
    }
    if(kosch) {
      if(item.koscher != 1) { state = false; }
    }
    return state;
  });

  for (var i = 0; i < drinksInfo.length; i++) {
    for (var j = 0; j < beerInfoList.length; j++) {
      if (drinksInfo[i].nr == beerInfoList[j].beer_id) {
        drinks.push(beerInfoList[j]);
      }
    }
  }
  getInventory(drinks, drinksInfo)

}
