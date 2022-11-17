//BOOK CLASS: REPRESENTS A BOOK
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//UI CLASS: HANDLE UI TASKS
class UI{
    static displayBooks(){
       
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
    }
    
    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');//Creates an HTML element

        //appends the tags into the html dom object
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete"> X </a> </td>
        `;

        list.appendChild(row);
    }

    //Delete function
    static deleteBook(etarget){
        if (etarget.classList.contains("delete")) {
            etarget.parentElement.parentElement.remove();
        }
    }

    //Show the alert
    static showAlert(message, className){
        const div = document.createElement('div'); //This creates the tag below
        //<div class="alert alert-success">Message</div>
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        //getting the elements
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        //this inserts the div tag BEFORE the form tag
        container.insertBefore(div, form);

        //vanishing the message in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    //Clear the fields in the form
    static clearFields(){
        document.querySelector("#title").value = '';
        document.querySelector("#author").value = '';
        document.querySelector("#isbn").value = '';
    }

    
}
//STORE CLASS: HANDLE LOCAL STORAGE
class Store{
    //Get books
    static getBooks(){
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));//Converts the string books into a JSON object
        }
        return books;
    }

    //Add Books
    static addBooks(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));//Converts into a string format
    }

    //Remove a book
    static removeBook(isbn){
        const books = Store.getBooks();//Returns a list of the books in the localStorage

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


//EVENTS: DISPLAY BOOK
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//EVENT: ADD A BOOK
document.querySelector("#book-form").addEventListener('submit', (e)=>{
    
    //prevent default submit button
    e.preventDefault();

    //Get values from the form
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    //VALIDATION
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in the fields', 'danger');
    }else{
        //Instantiate the book class
    const book = new Book(title, author, isbn);

    //success message
    UI.showAlert('Book Added', 'success');
    
    //appending the new book to the table list
    UI.addBookToList(book);

    //Add Book to localStorage
    Store.addBooks(book);

    //Clear fields after inputing a book
    UI.clearFields();
    }
    
});

//EVENT: REMOVE A BOOK
document.querySelector("#book-list").addEventListener("click", (e) => {
    //Removing book from IU
    UI.deleteBook(e.target);

    //Removing book from localStorage
    //This selects the <a> tag, then its parent element <td> and then 
    //the previous element <td>book.isbn</td>
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed', 'success');
})
