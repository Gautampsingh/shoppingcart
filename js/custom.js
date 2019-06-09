// Shopping Basket

var shoppingBasket = (function() {

    // cart = [];
    cart = [{"name":"CottonT-Shirts,Medium","price":1.99,"count":1},{"name":"BaseballCap,OneSize","price":2.99,"count":1},{"name":"SwimShorts,Medium","price":3.99,"count":1}]
    
    // Constructor
    function Item(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }
    
    // Save cart to session storage
    function saveCart() {
        if (typeof(Storage) == "undefined") {
            sessionStorage.setItem('shoppingBasket', JSON.stringify(cart));
        } else {
            // Sorry! No Web Storage support..
            cart = cart;
        }
    }
    
      // Load cart from session storage
    function loadCart() {
    if (typeof(Storage) == "undefined") {
        cart = JSON.parse(sessionStorage.getItem('shoppingBasket'));
    } else {
        // Sorry! No Web Storage support..
        cart = cart;
    }
    }

    if (typeof(Storage) == "undefined") {
        // Code for localStorage/sessionStorage.
        if (sessionStorage.getItem("shoppingBasket") != null) {
            loadCart();
        }
    } else {
        // Sorry! No Web Storage support..
        cart = cart;
    }


    if (typeof(Storage) == "undefined") {
        if (sessionStorage.getItem("shoppingBasket") != null) {
            loadCart();
          }
    }else{
        cart = cart;
    }

    
    var obj = {};
    
    // Add to cart
    obj.addItemToCart = function(name, price, count) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count ++;
          saveCart();
          return;
        }
      }
      var item = new Item(name, price, count);
      cart.push(item);
      saveCart();
    }
    // Set count from item
    obj.setCountForItem = function(name, count) {
      for(var i in cart) {
        if (cart[i].name === name) {
          cart[i].count = count;
          break;
        }
      }
    };
    // Remove item from cart
    obj.removeItemFromCart = function(name) {
        for(var item in cart) {
          if(cart[item].name === name) {
              if(cart[item].count > 0){
                cart[item].count --;
                // to delete the row on decrement
                /*if(cart[item].count === 0) {
                  cart.splice(item, 1);
                }*/
              }
            
            break;
          }
      }
      //saveCart();
    }
  
    // Remove all items from cart
    obj.removeItemFromCartAll = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart.splice(item, 1);
          break;
        }
      }
      //saveCart();
    }
  
    // Count cart 
    obj.totalItem = function() {
      var totalItem = 0;
      for(var item in cart) {
        totalItem += cart[item].count;
      }
      return totalItem;
    }
  
    // Total cart
    obj.totalCart = function() {
      var totalCart = 0;
      for(var item in cart) {
        totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
    }
  
    // List cart
    obj.listCart = function() {
      var cartCopy = [];
      for(i in cart) {
        item = cart[i];
        itemCopy = {};
        for(p in item) {
          itemCopy[p] = item[p];
  
        }
        itemCopy.total = Number(item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy)
      }
      return cartCopy;
    }
  
    return obj;
  })();
  
  var postObj = {};
  
  function displayCart() {
    var cartArray = shoppingBasket.listCart();
    var thead = "<tr><th>Product</th><th width='20%'>Price</th><th width='22%'>Qty</th><th width='20%'>Cost</th></tr>";
    var output = thead + "";
    for(var i in cartArray) {
        output += "<tr>"
        + "<td>" + cartArray[i].name + "</td>"
        + "<td>&#163;<span id='price'>" + cartArray[i].price + "</span></td>"
        + "<td><div class='quantity-container'>"
        + "<input type='text' id='quantity' class='flt quantity-amount item-count' onchange='quantitytxt()' name='' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "' />"
        + "<div class='flt plusminus'>"
        + "<span class='increase' data-name=" + cartArray[i].name + " onclick='increase(event)'> &#43;</span></div>"
		+ "<span class='decrease' data-name=" + cartArray[i].name + " onclick='decrease(event)'> &#8722;</span>"
        + "<div class='clear'></div>"
        + "</div></td>"
        + "<td>£<span id='cost'>" + cartArray[i].total + "</span><img src='images/deleteicon.png' onclick='removeItem()' class='deleteIcon removeItem' data-name='" + cartArray[i].name + "' /></td>"
        + "</tr>";
    }

    var tfoot = "<tr class='nopad'><td colspan='3'>Total quantity:</td><td><span id='totalitem'></span></td></tr>"
                + "<tr class='nopad'><td colspan='3'>Subtotal:</td><td>£<span id='subtotal'></span></td></tr>"
                + "<tr class='nopad'><td colspan='3'>VAT @ 20%:</td><td>£<span id='vat'></span></td></tr>"
                + "<tr class='fntbld'><td colspan='3'>Total Cost:</td><td>£<span id='totalcost'></span></td></tr>"
                + "<tr><td colspan='2'></td><td colspan='2' align='center'><button type='submit' class='btnBuyNow'>Buy Now >></button></td></tr>";

    output = output + tfoot;
    
    var vat = 0.2 * shoppingBasket.totalCart();
    var totalcost = vat + shoppingBasket.totalCart();
    
    document.getElementById("show-cart").innerHTML = output;
    document.getElementById("totalitem").innerHTML = shoppingBasket.totalItem();
    document.getElementById("subtotal").innerHTML = shoppingBasket.totalCart();
    document.getElementById("vat").innerHTML = vat.toFixed(2);
    document.getElementById("totalcost").innerHTML = totalcost.toFixed(2);

    postObj = {
        'quantities': shoppingBasket.totalItem(),
        'subtotal': shoppingBasket.totalCart() ,
        'totalcost': Number(totalcost.toFixed(2))
    }

    console.log(postObj);
    return postObj;
  }
  

//Submit and post json data

function submitData(){
    console.log(postObj);

    var xhr = new XMLHttpRequest();
    var url = "";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
    var json = JSON.parse(xhr.responseText);
    console.log(json.quantities + ", " + json.subtotal + ", " + json.totalcost);
    }
    };
    var data = JSON.stringify(postObj);
    console.group(data);
    xhr.send(data);
    
}
  

/********* Events handler**********/
// Delete item button
 
function removeItem(){
    var name = event.currentTarget.dataset.name;
    shoppingBasket.removeItemFromCartAll(name);
    displayCart();
}

// decrement
function decrease(event) {
    var name = event.currentTarget.dataset.name;
    shoppingBasket.removeItemFromCart(name);
    displayCart();
}

// increment
function increase(event) {
    var name = event.currentTarget.dataset.name;
    shoppingBasket.addItemToCart(name);
    displayCart();
}

// Item count input
function quantitytxt(){
    var name = event.currentTarget.dataset.name;
    var count = Number(event.currentTarget.value);
    shoppingBasket.setCountForItem(name, count);
    displayCart();
}
  
displayCart();
  