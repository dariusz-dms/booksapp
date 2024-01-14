class BooksList {
    constructor() {
        // Inicjalizacja danych
        this.initData();

        // Inicjalizacja elementów DOM
        this.getElements();

        // Inicjalizacja nasłuchiwaczy zdarzeń
        this.initActions();

        // Renderowanie książek
        this.renderBooks();
    }

    initData() {
        // Inicjalizacja danych
        this.data = dataSource.books;
        this.favoriteBooks = [];
        this.filters = [];
    }

    getElements() {
        // Referencje do elementów DOM
        this.booksList = document.querySelector('.books-list');
        this.filtersForm = document.querySelector('.filters form');
    }

    initActions() {
        // Dodanie nasłuchiwacza dla całej listy .books-list
        if (this.booksList) {
            this.booksList.addEventListener('click', (event) => this.handleBookClick(event));
        }

        // Dodanie nasłuchiwacza dla formularza
        if (this.filtersForm) {
            this.filtersForm.addEventListener('click', (event) => this.handleFilterClick(event));
        }
    }

    handleBookClick(event) {
        // Obsługa kliknięcia na książkę
        if (event.target.offsetParent && event.target.offsetParent.classList.contains('book__image')) {
            const bookId = event.target.offsetParent.getAttribute('data-id');
            const isBookFavorite = this.favoriteBooks.includes(bookId);

            if (!isBookFavorite) {
                event.target.offsetParent.classList.add('favorite');
                this.favoriteBooks.push(bookId);
            } else {
                const index = this.favoriteBooks.indexOf(bookId);
                this.favoriteBooks.splice(index, 1);
                event.target.offsetParent.classList.remove('favorite');
            }

            // Filtruj książki po zmianie w ulubionych
            this.filterBooks();
        }
    }

    handleFilterClick(event) {
        // Obsługa kliknięcia w checkbox w formularzu
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
            const filterValue = event.target.value;

            if (event.target.checked) {
                if (!this.filters.includes(filterValue)) {
                    this.filters.push(filterValue);
                }
            } else {
                const index = this.filters.indexOf(filterValue);
                if (index !== -1) {
                    this.filters.splice(index, 1);
                }
            }

            // Aktualizacja wybranych filtrów
            console.log(this.filters);

            // Filtruj książki po zmianie w filtrach
            this.filterBooks();
        }
    }

    filterBooks() {
        // Filtracja książek
        for (const book of this.data) {
            let shouldBeHidden = false;

            for (const filter of this.filters) {
                if (!book.details[filter]) {
                    shouldBeHidden = true;
                    break;
                }
            }

            const bookImage = this.booksList.querySelector(`.book__image[data-id="${book.id}"]`);

            if (bookImage) {
                if (shouldBeHidden) {
                    bookImage.classList.add('hidden');
                } else {
                    bookImage.classList.remove('hidden');
                }
            }
        }
    }

    renderBooks() {
        // Renderowanie książek
        this.data.forEach(book => {
            const html = Handlebars.compile(bookTemplate)(book);
            const bookElement = document.createElement('li');
            bookElement.classList.add('book');
            bookElement.innerHTML = html;
            if (this.booksList) {
                this.booksList.appendChild(bookElement);
            }
        });
    }
}

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', () => {
    const app = new BooksList();
});
