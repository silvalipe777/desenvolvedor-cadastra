import { Product } from "./Product";

const serverUrl = "http://localhost:5000";
let currentPage = 1
let order:String = ""
let filterColor:String[] = []
let filterSize:String[] =[]
let priceRange:String[] = []
 function main() {

  loadingProducts()
}
async function loadingProducts(){
  const productsList = fetchProducts(currentPage, order,filterColor,filterSize,priceRange )
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
  if(currentPage ===1){
  productContainer.innerHTML = products.map(product => createCard(product)).join("")
  }else{
    productContainer.innerHTML += products.map(product => createCard(product)).join("")
  }



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
              <button>Comprar</button>
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
  currentPage ++
  loadingProducts()
}
function showAllColor(): void {
  let listColors = document.getElementById("ul-all-colors")
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
document.addEventListener("DOMContentLoaded", main);
