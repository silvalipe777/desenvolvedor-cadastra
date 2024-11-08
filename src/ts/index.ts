import { Product } from "./Product";
import { CartItem } from "./Cart";


const serverUrl = "http://localhost:5000";
let currentPage = 1
let order: String = ""
let filterColor: String[] = []
let filterSize: String[] = []
let priceRange: String[] = []
function main() {

  loadingProducts()
}
async function loadingProducts() {
  const productsList = fetchProducts(currentPage, order, filterColor, filterSize, priceRange)
  listProducts(await productsList);
}
async function fetchProducts(page: Number, sort: String, colorsFilters: String[], sizeFilters: String[], priceFilters: String[]): Promise<Product[]> {
  let url = new URL("/products", serverUrl)
  let params = new URLSearchParams
  params.append("_page", page.toString())
  switch (sort) {
    case "preco-crescente":
      params.append("_sort", "price")
      params.append("_order", "asc")
      break;
    case "preco-decrescente":
      params.append("_sort", "price")
      params.append("_order", "desc")
      break;
    case "data-recente":
      params.append("_sort", "date")
      params.append("_order", "desc")
    default:
      break;
  }
  if (colorsFilters.length > 0) {
    colorsFilters.forEach(color => params.append("color", color.toString())
    )
  }
  if (priceFilters.length > 1) {
    params.append("price_gte", priceFilters[0].toString())
    params.append("price_lte", priceFilters[1].toString())

  }
  if (sizeFilters.length > 0) {
    sizeFilters.forEach(size => params.append("size_like", size.toString())
    )
  }
  url.search = params.toString()

  try {
    const reponse = await fetch(url)
    const products = await reponse.json()
    return products
  }

  catch (error) {
    console.error("Failed to fetch products", error);
    return []
  }

}
function listProducts(products: Product[]): void {
  const productContainer = document.getElementById("product-container");
  if (!productContainer) {
    console.error("Product container not found")
    return
  }
  if (currentPage === 1) {
    productContainer.innerHTML = products.map(product => createCard(product)).join("")
  } else {
    productContainer.innerHTML += products.map(product => createCard(product)).join("")
  }

  document.querySelectorAll(".plp .product-card button").forEach(button => {

    button.addEventListener("click", () => {
      let productId = button.getAttribute("data-product-id")
      addToCart(productId)


    });

  });



}
function formatPrice(price: Number) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatInstallment(installment: Number[]) {
  return `até ${installment[0]}x de ${formatPrice(installment[1])}`
}

function createCard(product: Product): string {
  return `<div class="product-card">
            <img src="${product.image}" alt="">
            <div class="product-card__description">
              <h3>${product.name}</h3>
              <p  class="price">${formatPrice(product.price)}<p>
              <p>${formatInstallment(product.parcelamento)}</p>
              <button data-product-id="${product.id}">Comprar</button>
            </div>
          </div>`
}
function showOrderModal(): void {
  let modal = document.getElementById("order-modal")
  modal.classList.add("show-modal")
  return
}
function showFilterModal(): void {
  let modal = document.getElementById("filter-modal")
  modal.classList.add("show-modal")
  return
}
function closeFilterModal(): void {
  let modal = document.getElementById("filter-modal")
  modal.classList.remove("show-modal")
  return
}
function closeOrderModal(): void {
  let modal = document.getElementById("order-modal")
  modal.classList.remove("show-modal")
  return
}

function showMore(): void {
  currentPage++
  loadingProducts()
}
function showAllColor(): void {
  let listColors = document.getElementById("ul-all-colors-desktop")
  let button = document.getElementById("button-show-all-colors")
  listColors.classList.add("show-all-colors")
  button.style.display = "none"
  return
}


document.getElementById("button-show-all-colors").addEventListener("click", showAllColor);
document.getElementById("order-button").addEventListener("click", showOrderModal);
document.getElementById("filter-button").addEventListener("click", showFilterModal);
document.getElementById("close-order-button").addEventListener("click", closeOrderModal);
document.getElementById("close-filter-button").addEventListener("click", closeFilterModal);
document.getElementById("show-more-button").addEventListener("click", showMore);
document.querySelectorAll("#list-order-mobile li").forEach(button => {
  button.addEventListener("click", () => {
    let sortBy = button.getAttribute("data-order")
    order = sortBy
    currentPage = 1
    loadingProducts()
    closeOrderModal()

  });
});
document.querySelectorAll("#checkboxes-price-desktop li input").forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    const price_gte = checkbox.getAttribute("data-order-price-gte")
    const price_lte = checkbox.getAttribute("data-order-price-lte")
    const sortBy = [price_gte, price_lte]

    if (checkbox.checked) {
      priceRange = sortBy
      document.querySelectorAll("#checkboxes-price-desktop li input").forEach(cb => {
        if (price_gte != cb.getAttribute("data-order-price-gte") || price_lte != cb.getAttribute("data-order-price-lte")) {
          cb.checked = false
        }
      })

    } else {
      priceRange = []
    }
    currentPage = 1
    loadingProducts()
  });
});

document.querySelectorAll("#ul-all-colors-desktop li input").forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    const sortBy = checkbox.getAttribute("data-order-color")
    const index = filterColor.indexOf(sortBy)

    if (checkbox.checked && index === -1) {
      filterColor.push(sortBy)
    }
    else if (index != -1) {
      filterColor.splice(index, 1)
    }
    currentPage = 1
    loadingProducts()
  });
});
document.querySelectorAll("#ul-all-sizes-desktop li").forEach(button => {
  button.addEventListener("click", () => {
    const sortBy = button.getAttribute("data-order-size")
    const index = filterSize.indexOf(sortBy)
    button.classList.toggle("size-selected")

    if (button.classList.contains("size-selected") && index === -1) {
      filterSize.push(sortBy)
    }
    else if (index != -1) {
      filterSize.splice(index, 1)
    }
    currentPage = 1
    loadingProducts()
  });
});


document.getElementById("btn-open-dropdown-order").addEventListener("click", handleClickDropdown);
function handleClickDropdown() {
  document.getElementById("dropdown-order-desktop").classList.toggle("show-dropdown-order");
  return false;
}
document.querySelectorAll("#list-order-desktop li").forEach(button => {
  button.addEventListener("click", () => {
    let sortBy = button.getAttribute("data-order")
    document.querySelector("#btn-open-dropdown-order span").innerText = button.textContent;
    currentPage = 1
    order = sortBy
    currentPage = 1
    loadingProducts()
    handleClickDropdown()


  });
});

let filterColorMobile: String[] = []
let filterSizeMobile: String[] = []
let priceRangeMobile: String[] = []


document.querySelectorAll("#ul-all-colors-mobile li input").forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    const sortBy = checkbox.getAttribute("data-order-color")
    const index = filterColorMobile.indexOf(sortBy)

    if (checkbox.checked && index === -1) {
      filterColorMobile.push(sortBy)
    }
    else if (index != -1) {
      filterColorMobile.splice(index, 1)
    }
  });
});

document.querySelectorAll("#ul-all-sizes-mobile li").forEach(button => {
  button.addEventListener("click", () => {
    const sortBy = button.getAttribute("data-order-size")
    const index = filterSizeMobile.indexOf(sortBy)
    button.classList.toggle("size-selected")

    if (button.classList.contains("size-selected") && index === -1) {
      filterSizeMobile.push(sortBy)
    }
    else if (index != -1) {
      filterSizeMobile.splice(index, 1)
    }

  });
});

document.querySelectorAll("#checkboxes-price-mobile li input").forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    const price_gte = checkbox.getAttribute("data-order-price-gte")
    const price_lte = checkbox.getAttribute("data-order-price-lte")
    const sortBy = [price_gte, price_lte]

    if (checkbox.checked) {
      priceRangeMobile = sortBy
      document.querySelectorAll("#checkboxes-price-mobile li input").forEach(cb => {
        if (price_gte != cb.getAttribute("data-order-price-gte") || price_lte != cb.getAttribute("data-order-price-lte")) {
          cb.checked = false
        }
      })

    } else {
      priceRangeMobile = []
    }

  });
});

function applyFilters(): void {
  filterColor = filterColorMobile
  filterSize = filterSizeMobile
  priceRange = priceRangeMobile
  currentPage = 1
  loadingProducts()
  closeFilterModal()

}

function cleanFilters(): void {
  document.querySelectorAll("#ul-all-colors-mobile li input").forEach(checkbox => {

    checkbox.checked = false

  });
  filterColorMobile = []

  document.querySelectorAll("#ul-all-sizes-mobile li").forEach(button => {
    button.classList.remove("size-selected")
  });
  filterSizeMobile = []

  document.querySelectorAll("#checkboxes-price-mobile li input").forEach(checkbox => {
    checkbox.checked = false
  });
  priceRangeMobile = []

}
document.getElementById("btn-apply-filters").addEventListener("click", applyFilters);
document.getElementById("btn-clean-filters").addEventListener("click", cleanFilters);




document.querySelectorAll(".btn-dropdown-filter-mobile").forEach(buttonDropdown => {
  buttonDropdown.addEventListener("click", () => {
    let dropdown = buttonDropdown.nextElementSibling
    dropdown.classList.toggle("show-dropdown-filter-modal")
    let hasModalOpen = false
    document.querySelectorAll(".modal .list-filters__buttons, .modal .list-filters__checkboxes").forEach(dropdownVerify => {

      if (dropdownVerify.classList.contains("show-dropdown-filter-modal")) {
        hasModalOpen = true
        document.querySelector(".modal .mobile-filter-actions").style.visibility = "visible"

      }

    })
    if (!hasModalOpen) {
      document.querySelector(".modal .mobile-filter-actions").style.visibility = "hidden"
    }
    return false;
  })

})




let cart: CartItem[] = []
function updateCartCount(): void {
  const cartReduce = cart.reduce((total, item) => total + item.quantity, 0).toString()
  let cartIcon = document.getElementById("cart-count")
  cartIcon.innerText = cartReduce
  if (
    cartReduce !== "0"
  ) {
    cartIcon.style.display = "block"
  }
}
function addToCart(productId: string): void {
  let product = cart.find(product => product.id === productId)
  if (product) {
    product.quantity++
  } else {
    product = {
      id: productId,
      quantity: 1
    }
    cart.push(product)
  }
  updateCartCount()
}


// function createCard(product: Product): string {
//   return `<div class="product-card">
//             <img src="${product.image}" alt="">
//             <div class="product-card__description">
//               <h3>${product.name}</h3>
//               <p  class="price">${formatPrice(product.price)}<p>
//               <p>${formatInstallment(product.parcelamento)}</p>
//               <button data-product-id="${product.id}">Comprar</button>
//             </div>
//           </div>`
// }
document.addEventListener("DOMContentLoaded", main);

