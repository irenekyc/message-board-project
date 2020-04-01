
const Pagination = document.querySelector('.pagination-container')
const filterContainer = document.querySelector('.filter-container')




Pagination.addEventListener('click', (e)=>{
    const searchQuery = window.location.search
    const spilt = searchQuery.split("page=")
    console.log(spilt)
   
    if (e.target.classList.value === 'next'){
        const nextPage = parseInt(spilt[1])+1
        const nextPageUrl = (`http://${window.location.host}${window.location.pathname}${spilt[0]}page=${nextPage}`).toString()
        window.location.replace(nextPageUrl)
    }
    if (e.target.classList.value === 'prev'){
        const prevPage = parseInt(spilt[1])-1
        const prevPageUrl = (`http://${window.location.host}${window.location.pathname}${spilt[0]}page=${prevPage}`).toString()
        window.location.replace(prevPageUrl)
    }
})

filterContainer.addEventListener('click', (e)=>{
    if (e.target.classList.value === "sort-filter"){
        const searchQuery = window.location.search
        let query
        if(searchQuery.includes("sort=")){
        const split = searchQuery.split("&")
        const sortIndex = split.findIndex(query=>query.includes("sort"))
            if (e.target.id === "sort-desc"){
                split[sortIndex] = "sort=descending"
            } else if (e.target.id === "sort-asc"){
                split[sortIndex] = "sort=ascending"
            }
            query = split.join("&")
        } else {
            if (e.target.id === "sort-desc"){
                 query = searchQuery.concat("&sort=descending")

            } else if (e.target.id === "sort-asc"){
                 query = searchQuery.concat("&sort=ascending")
   
            }
        }
        const URL = (`http://${window.location.host}${window.location.pathname}${query}`).toString()
        console.log(URL)
      window.location.replace(URL)
    }

})


