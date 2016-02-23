function filterDrinks(eco, kosch) {
  var drinksInfo = [];
  var drinks = [];
  drinksInfo = beerInfoList2.filter(function(item) {
    var state = true;
    if (eco) {
      if (item.ekologisk != 1) { state = false; }
    }
    if (kosch) {
      if (item.koscher != 1) { state = false; }
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

function searchDrinks(str) {
  drinks = [];
  drinksInfo = beerInfoList2.filter(function(item) {
    if (item.namn.toLowerCase().indexOf(str.toLowerCase()) > -1) {
      return true;
    }
    return false;
  });

  for (var i = 0; i < drinksInfo.length; i++) {
    for (var j = 0; j < beerInfoList.length; j++) {
      if (drinksInfo[i].nr == beerInfoList[j].beer_id) {
        drinks.push(beerInfoList[j]);
      }
    }
  }

  getInventory(drinks, drinksInfo);
}
