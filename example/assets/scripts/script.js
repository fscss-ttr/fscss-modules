const sidebar = document.querySelector(".sidebar");
const togglebar = document.querySelector(".toggle-menu");

togglebar.addEventListener("click", e=>{
  sidebar.classList.toggle("hide");
  if(!sidebar.classList.contains('hide')){
    togglebar.querySelector("span").classList.replace("icon-menu","icon-times");
  }
  else {
  togglebar.querySelector("span").classList.replace("icon-times", "icon-menu"); 
  }
})
