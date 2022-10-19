import { Producto } from "./product.js";

var arrayProductos = [];
let main = document.querySelector("#root");

const getRequest = async () => {
  let req = await fetch('./sneakers.JSON');

  let response = await req.json();
  console.log(response);

  for (const el of response.products) {
    arrayProductos.push(el);
  }
  generarCards(arrayProductos);
};

const generarCards = (array) => {
  array.forEach((element) => {

    
    main.innerHTML += `

            <div class='card'>
                <img class='card-img-top product-img' src=${element.thumbnail} alt="">
                <h3 class='card-title product-title'>${element.title}</h3>
                <p class='card-description'>${element.description}</p>
                <div class= 'card-price'>
                <span>Precio:</span>
                <span class='text-underline product-price'>$${element.price}</span>
                </div>
                <a class="add-cart" id='${element.id}'>Agregar al carrito</a>
            </div>

            `;

  });

  


  // -----------Remove item
  var removeCartButtons = document.getElementsByClassName("cart-remove");


  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  // Quantity changes
  var quantityInput = document.getElementsByClassName("cart-quantity");

  for (var i = 0; i < quantityInput.length; i++) {
    var input = quantityInput[i];
    input.addEventListener("change", quantityChanged);
  }

  // -----------Add to cart
  var addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }


};

// CART
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#cart-close");

// Open cart
cartIcon.onclick = () => {
  cart.classList.add("active");
};
// Close cart
closeCart.onclick = () => {
  cart.classList.remove("active");
};

// Cart

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", getRequest);
} else {
  getRequest();
}

// Remove cart Item
function removeCartItem(event) {
  var buttonClicked = event.target;
  var box = buttonClicked.parentElement
  var detailBox = box.children[1]
  var cartItemsNames = detailBox.getElementsByClassName("cart-product-title")[0].innerText;
  var cartItemsDescription = detailBox.getElementsByClassName("cart-product-description")[0].innerText;
    buttonClicked.parentElement.remove();
    localStorage.removeItem(cartItemsNames+cartItemsDescription)
  updateTotal();
}


// Quantity Changes
function quantityChanged(event) {
  var input = event.target;
  let id 
  var inputParent = input.parentElement
  var inputParentImage = inputParent.parentElement
console.log(inputParent.attributes[4])
console.log(inputParentImage)


if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
}

var title = inputParent.getElementsByClassName("cart-product-title")[0].innerText;
var description = inputParent.getElementsByClassName("cart-product-description")[0].innerText;
var price = inputParent.getElementsByClassName("cart-price")[0].innerText;
var image = inputParentImage.getElementsByClassName("cart-image")[0].src;
console.log(title, description)

let resultado = arrayProductos.find(el => el.id == id)
console.log(resultado)

// const productToSet = {'title': title,'price': price ,'image': image, 'description': description, 'quantity': input.value}
let product = new  Producto(title, price, image, description, id ,input.value)

localStorage.setItem(title + description, JSON.stringify(product))

  updateTotal();

}

// Add to cart
function addCartClicked(event) {
  cart.classList.add("active");
  let button = event.target;
  
  let id = button.attributes[1].value
  let resultado = arrayProductos.find(el => el.id == id)

  // const productToSet = {'title': resultado.title,'price': resultado.price ,'image': resultado.thumbnail, 'description': resultado.description}
  let product = new Producto(resultado.title, resultado.price, resultado.thumbnail, resultado.description, resultado.id, 1)

  // console.log(product)
  localStorage.setItem(resultado.title + resultado.description,JSON.stringify(product))

//   addProductToCart(resultado.title, resultado.price, resultado.thumbnail, resultado.description);
addProductToCart(resultado.title, resultado.price, resultado.thumbnail, resultado.description, 1, resultado.id)

  updateTotal();
}

// Local Storage
var elements = [];

for(var x = 0; x <= localStorage.length; x++) {
    elements.push(JSON.parse(localStorage.getItem(localStorage.key(x))));
    console.log('ok')
}


if(localStorage.length > 0){

  elements.map(el => {
    addProductToCart(el.nombre, el.precio, el.imagen, el.descripcion, el.quantity, el.id)
    updateTotal()

    console.log(el)
    console.log('ok2')
  })

    }

function addProductToCart(title, price, image, description, quantity, id) {
    
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add('cart-box')
  var cartItems = document.getElementsByClassName("cart-content")[0];
  var cartItemsDescription = cartItems.getElementsByClassName("cart-product-description");
  for (var i = 0; i < cartItemsDescription.length; i++) {
      if(cartItemsDescription[i].innerText == description){
        swal({
          title: "Error",
          text: "Este producto ya fue agregado al carrito!",
          icon: "warning",
          button: "Volver",
        });
        return;
      }
}


  var cartBoxContent = `
  <img src=${image} class="cart-image">
  <div class="detail-box">
      <div class="cart-product-title">
          ${title}
      </div>
      <div class="cart-product-description">
          ${description}
      </div>
      <div class="cart-price">
          ${price}
      </div>
      <input type="number" id='${id}' value=${quantity? quantity : '1'} class="cart-quantity" />
  </div>
  <!-- Eliminar del carrito -->
  <i class='bx bx-trash cart-remove'></i>
`

cartShopBox.innerHTML = cartBoxContent;
cartItems.append(cartShopBox);
cartShopBox
  .getElementsByClassName("cart-remove")[0]
  .addEventListener("click", removeCartItem);
cartShopBox
  .getElementsByClassName("cart-quantity")[0]
  .addEventListener("change", quantityChanged);
;
}

// Update total
function updateTotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var total = 0;
  

  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;


    // If price Contain some Cents value
    total = Math.round(total * 100) / 100;

}

// Item Cart Counter
const cartCounter = document.getElementById('cart-counter')
cartCounter.innerText=!cartBoxes.length ? '0' : cartBoxes.length

if(cartBoxes.length === 0){
    document.querySelector('.cart-empty').innerText= 'Parece que el carrito esta vacio, agregale algo!'
    document.getElementsByClassName("total-price")[0].innerText = '$0';    
}
else {
    document.querySelector('.cart-empty').innerText = ''
    document.getElementsByClassName("total-price")[0].innerText = `
    $${total}
`;
}

}
