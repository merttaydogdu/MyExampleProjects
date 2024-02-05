const filterButtons = document.querySelectorAll("#filter-buttons button");
const filterableCards = document.querySelectorAll("#filterable-cards .card");

const filterCards = (e) => {
    const selectedFilter = e.target.dataset.filter;


    document.querySelector("#filter-buttons .active").classList.remove("active");
    e.target.classList.add("active");

    filterableCards.forEach(card => {
        const cardCategory = card.dataset.name;

        if (selectedFilter === "all" || selectedFilter === cardCategory) {
            card.classList.remove("hide");
        } else {
            card.classList.add("hide");
        }
    });
}

filterButtons.forEach(button => button.addEventListener("click", filterCards));
