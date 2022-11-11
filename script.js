//form input fields

let firstNameInput = document.getElementById('firstname-input')
let lastNameInput = document.getElementById('lastname-input')
let emaiInput = document.getElementById('email-input')
let telNameInput = document.getElementById('tel-input')
let notesInput = document.getElementById('notes-input')

//Contact class creation and contact and favorite creation functionality

const contacts = []
const favorites = []
const reminders = []

class Contact {
    constructor() {
        this.firstname = firstNameInput.value
        this.lastname = lastNameInput.value
        this.email = emaiInput.value
        this.number = telNameInput.value
        this.notes = notesInput.value
        this.date = Date()
        this.favorite = false
        this.id = `C${contacts.length + 1}`
        this.reminders = []
    }
}

function createContact() {
    new Promise((res,rej) => {
        let newContact = new Contact()
        console.log(`New contact ${newContact.firstname} was added to CRM. Id is ${newContact.id}`)
        res(newContact)
    }).then((contact) => {
        contacts.push(contact)
    }).then(() => {
        //reset form fields
        firstNameInput.value = null
        lastNameInput.value = null
        emaiInput.value = null
        telNameInput.value = null
        notesInput.value = null
    }).then(() => {
        //displays new contact in sidebar

        let item = contacts[contacts.length - 1]
        let contactListDiv = document.getElementById('client-list')
        let div = document.createElement('div')
        div.classList.add('contact-div')
        let p = document.createElement('p')
        p.innerText = item.firstname+' '+item.lastname
        p.classList.add('contact-names')
        p.setAttribute('id', item.id)
        let span = document.createElement('span')
        span.innerHTML = 'emoji_people'
        span.classList.add('material-symbols-outlined')
        span.addEventListener('click', () => displayPage(item))

        let deleteButton = document.createElement('span')
        deleteButton.innerHTML = 'delete'
        deleteButton.classList.add('material-symbols-outlined')
        deleteButton.addEventListener('click', () => deleteContact(item))

        div.append(p,span,deleteButton)
        contactListDiv.append(div) 
        const h1 = document.querySelector('h1')
        h1.innerText = `Contacts - ${contacts.length}`
        
    })
}

const newContactButton = document.getElementById('newcontact-button')
newContactButton.addEventListener('click' , createContact)

//display contact page functionality

let dashboard = document.getElementById('dashboard')
let contactPage = document.getElementById('contactpage')
let contactFirstInput = document.getElementById('contactpage-first-input')
let contactLastInput = document.getElementById('contactpage-last-input')
let contactTelInput = document.getElementById('contactpage-tel-input')
let contactEmailInput = document.getElementById('contactpage-email-input')
let contactDateInput = document.getElementById('contactpage-date-input')
let contactNotesInput = document.getElementById('contactpage-notes-input')
let contactFavoriteInput = document.getElementById('contactpage-favorite-input')

let currentContact = null

function displayPage(target) {
    if(contactPage.style.display == 'flex') {
        dashboard.style.display = 'grid'
        contactPage.style.display = 'none'
        currentContact = null
        resetSearchResults()
    }else {
        currentContact = target
        dashboard.style.display = 'none'
        contactPage.style.display = 'flex'
        contactFirstInput.value = target.firstname
        contactLastInput.value = target.lastname
        contactEmailInput.value = target.email
        contactTelInput.value = target.number
        contactNotesInput.value = target.notes
        contactDateInput.value = target.date
        contactFavoriteInput.checked = target.favorite
        console.log(`Viewing ${target.firstname}'s contact page`)
    }
}

//update functionality for contact page

const updateButton = document.getElementById('updatebutton')
updateButton.addEventListener('click', updateContact)

const contactPageBackButton = document.getElementById('contactpage-backbutton')
contactPageBackButton.addEventListener('click', displayPage)

function updateContact() {
    currentContact.firstname = contactFirstInput.value
    currentContact.lastname = contactLastInput.value
    currentContact.email = contactEmailInput.value
    currentContact.number = contactTelInput.value
    currentContact.date = contactDateInput.value
    currentContact.notes = contactNotesInput.value
    currentContact.favorite = contactFavoriteInput.checked
    let dashboardContactNames = document.querySelectorAll('.contact-names')
    dashboardContactNames.forEach((name) => {
        if(name.id == currentContact.id) {
            console.log(`${currentContact.firstname}'s info was updated`)
            name.innerText = currentContact.firstname+" "+currentContact.lastname
        }
    })
    if(currentContact.favorite == true && !favorites.includes(currentContact)) {
        createFavorite(currentContact)
    }

    if(currentContact.favorite == false && favorites.includes(currentContact)) {
        removeFavorite(currentContact)
    }
    displayPage()
}


//searchbar functionality

const searchInput = document.getElementById('search-input')
const searchButton = document.getElementById('search-button')
const searchResultsDiv = document.getElementById('search-resultsdiv')

function resetSearchResults() {
    searchInput.value = null
    while(searchResultsDiv.firstChild) {
        searchResultsDiv.removeChild(searchResultsDiv.firstChild)
    }
}

searchButton.addEventListener('click', () => {
    contacts.forEach((contact) => {
        if(contact.firstname.includes(searchInput.value) || contact.lastname.includes(searchInput.value) || contact.email.includes(searchInput.value)) {
            console.log(`Contact id: ${contact.id} matches`)
            let newDiv = document.createElement('div')
            newDiv.classList.add('match-div')
            let match = document.createElement('p')
            match.innerText = contact.firstname+" "+contact.lastname+" found"
            let matchButton = document.createElement('button')
            matchButton.innerText = 'View'
            matchButton.addEventListener('click', () => {
                resetSearchResults()
                displayPage(contact)
            })
            newDiv.append(match,matchButton)
            searchResultsDiv.append(newDiv)
        }else {
            return
        }
    })
})

//creates contact delete functionality
function deleteContact(target) {
    let index = contacts.indexOf(target)
    contacts.splice(index,1)
    console.log(`${target.firstname} has been deleted from contacts`)

    let contactDivsContainer = document.getElementById('client-list')
    let contactDivsList = contactDivsContainer.childNodes
    contactDivsList.forEach((div) => {
        if(div.firstChild.innerText == target.firstname+' '+target.lastname) {
            console.log(`Found a div to delete that has ${target.firstname+' '+target.lastname} as the innerText`)
            contactDivsContainer.removeChild(div)
        }
    })

    let h1 = document.querySelector('h1')
    if(contacts.length == 0) {
        h1.innerText = `Contacts`
    }else {
        h1.innerText = `Contacts - ${contacts.length}`
    }
    if(favorites.includes(target)) {
        removeFavorite(target)
    }
}

//creates functionality to allow favoriting contacts and removing favorites

function createFavorite(contact) {
    favorites.push(contact)
    const hotlistDiv = document.getElementById('hotlist-div')
    let div = document.createElement('div')
    div.classList.add('contact-div')
    let p = document.createElement('p')
    p.innerText = contact.firstname+' '+contact.lastname
    let span = document.createElement('span')
    span.classList.add('material-symbols-outlined')
    span.innerHTML = 'emoji_people'
    span.addEventListener('click', () => displayPage(contact))
    div.append(p,span)
    hotlistDiv.append(div)
    console.log(`${contact.firstname} was added to the Hot List`)
}

function removeFavorite(contact) {
    let index = favorites.indexOf(contact)
    favorites.splice(index,1)
    console.log(`${contact.firstname} was removed from the Hot List`)

    const hotlistDiv = document.getElementById('hotlist-div')
    const hotlistNodes = hotlistDiv.childNodes
    hotlistNodes.forEach((div) => {
        if(div.firstChild.innerText == contact.firstname+' '+contact.lastname) {
            hotlistDiv.removeChild(div)
        }
    })
}

//reminders creation functionality

function createReminder(contact) {
    let reminderTask = document.getElementById('reminder-input').value
    let reminderDate = document.getElementById('reminder-date-input').value
    let newReminder = {task: `${reminderTask} - ${contact.firstname}`, date:reminderDate, contact: contact}
    reminders.push(newReminder)
    contact.reminders.push(newReminder)
    console.log(`new reminder created for ${newReminder.contact}`)

    let reminderDiv = document.getElementById('reminderslist-div')
    let div = document.createElement('div')
    div.classList.add('reminder-div')
    let p = document.createElement('p')
    p.innerText = newReminder.task
    let doneButton = document.createElement('button')
    doneButton.innerText = 'DONE'
    div.append(p,doneButton)
    reminderDiv.prepend(div)

    document.getElementById('reminder-input').value = null
    document.getElementById('reminder-date-input').value = null
}

let reminderButton = document.getElementById('newreminder-button')
reminderButton.addEventListener('click', () => createReminder(currentContact))