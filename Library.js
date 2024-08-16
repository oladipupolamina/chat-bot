"use strict";
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
class User {
    constructor(name) {
        this.borrowedBooks = [];
        // this.id = nanoid(10)
        this.id = makeid(5);
        this.name = name;
    }
    borrow(library, bookISBN) {
        // console.log(this.id);
        const isMember = library.members.filter((v) => {
            console.log(v.id, " ::: ", this.id);
            return v.id == this.id;
        });
        // console.log("Members ::: ", library.members)
        if (isMember.length == 0) {
            console.log(`You are not a member of this ${library.name} Library`);
            return;
        }
        const availableBook = library.books.filter((v) => {
            console.log(v.ISBN, " ::: ", bookISBN);
            return v.ISBN == bookISBN;
        });
        if (availableBook.length == 0) {
            console.log(`This library does not have the requested book`);
            return;
        }
        if (this.borrowedBooks.length == 3) {
            console.log(`You cannot borrow 3 books at a time.`);
            return;
        }
        if (availableBook[0].isBorrowed) {
            console.log(`This book have been borrowed.`);
            return;
        }
        console.log(`You have borrowed ${book.title} Successfuly`);
        const index = this.borrowedBooks.indexOf(availableBook[0]);
        availableBook[0].isBorrowed = true;
        this.borrowedBooks[index] = availableBook[0];
        this.borrowedBooks.push(availableBook[0]);
    }
    returnBook(book, library) {
    }
}
class Book {
    constructor(title, ISBN, author, isBorrowed = false) {
        this.title = title;
        this.ISBN = ISBN;
        this.isBorrowed = isBorrowed;
        // this.id = nanoid(10);
        this.id = makeid(5);
        this.author = author;
    }
}
class Library {
    constructor(name) {
        this.members = [];
        this.books = [];
        this.name = name;
    }
    registerMember(member) {
        const isMember = this.members.find((v) => { v.id == member.id; });
        if (isMember) {
            console.log(`You are aleady a member of this ${library.name} Library`);
        }
        else {
            console.log(`Your registratio as a member of ${library.name} Library is Successful`);
            this.members.push(member);
        }
    }
    registerBook(book) {
        const books = this.books.filter((v) => { v.id == book.ISBN; });
        if (books.length != 0) {
            console.log(`This book already exist in the Library`);
        }
        else {
            console.log(`This have been registered successfully.`);
            this.books.push(book);
        }
    }
    borrowBook(member, bookISBN) {
    }
    isBookAvailable(bookISBN) {
        var _a;
        return (_a = this.books.find((v) => v.ISBN == bookISBN)) !== null && _a !== void 0 ? _a : false;
    }
    isMember(id) {
        var _a;
        return (_a = this.members.find((v) => v.id == id)) !== null && _a !== void 0 ? _a : false;
    }
}
const user1 = new User("Abayomi");
const book = new Book("Islamic Spirituality", "ISP", user1);
const library = new Library("Obafemi Awolowo");
// Register a member to a library
library.registerMember(user1);
// Register a book to a library
library.registerBook(book);
console.log(library.members);
user1.borrow(library, book.ISBN);
user1.borrow(library, book.ISBN);
console.log(book.author.name);
