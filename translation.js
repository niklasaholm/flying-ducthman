var translation = {
  english: {
             beers: "Beers", 
             ciders: "Ciders",
             wines: "Wines",
             order: "Order",
             placeDrinks: "Place your drinks here!",
             total: "Total",
             price: "Price",
             alcohol: "Alcohol",
             buy: "Buy",
           },

  swedish: {
             beers: "Öl", 
             ciders: "Cider",
             wines: "Vin",
             order: "Beställning",
             placeDrinks: "Placera dina drycker här",
             total: "Totalt",
             price: "Pris",
             alcohol: "Alkohol",
             buy: "Köp",
           }
}


function translate(language) {
  var tags = document.getElementsByClassName("lang");
      for (i = 0; i < tags.length; i++) {
        var k = tags[i].getAttribute("tkey");
        tags[i].innerHTML = translation[language][k];
      } 
}
