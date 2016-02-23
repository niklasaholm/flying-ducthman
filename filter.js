function filterBeers() {
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
