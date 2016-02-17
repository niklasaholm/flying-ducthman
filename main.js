function getInventory(){
//var my_json;
//var my_url="http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=inventory_get"
    //$.getJSON(my_url, function(json) {
  //my_json = json;
  //console.log(my_json.payload[0]);
  /*var beers=[];
  for(i = 0; i < my_json.payload.length; i++){
    beers.push(my_json.payload[i].namn);
  }*/
  //beers=my_json.payload;
  var list1 = '<h4 id="beers">Beers</h4><ul class="nav nav-sidebar">';
  var list2 = '<h4 id="wines">Wines</h4><ul class="nav nav-sidebar">';
  var list3 = '<h4 id="ciders">Ciders</h4><ul class="nav nav-sidebar">';
  var list4 = '<h4 id="nonalc">Non-Alcoholic</h4><ul class="nav nav-sidebar">';
  var beers=beerInfoList;
  var beerInfo=beerInfoList2;
   for (var i = 0; i < beerInfo.length; i++) { // Each sub-entry
            list1+=sortBeverages(beers[i],beerInfo[i],"Ö");
            list2+=sortBeverages(beers[i],beerInfo[i],"V");
            list2+=sortBeverages(beers[i],beerInfo[i],"R");
            list3+=sortBeverages(beers[i],beerInfo[i],"C");
            list4+=sortBeverages(beers[i],beerInfo[i],"A");
            //list1 += '<li><a id="'+beers[i].beer_id+'" class="beeritem"><div>'+beers[i].namn+'</div><div class="price" q="" p="">'+beerInfo[i].prisinklmoms+'£</div></a></li>';
        }
    list1 += '</ul>';
    list2 += '</ul>';
    list3 += '</ul>';
    list4 += '</ul>';
  $('#beerList').append(list1);
  $('#beerList').append(list3);
  $('#beerList').append(list2);
  $('#beerList').append(list4);

  for (var i = 0; i < beerInfo.length; i++) { 
    outOfStock(beers[i], beerInfo[i]);
    //console.log(beerInfo[i].varugrupp);
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
  getInventory();
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


