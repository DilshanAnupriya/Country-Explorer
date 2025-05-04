[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

## 🌍 CountriesExplorer - React Application

### *Site URL:*  https://globeguidecountryexplorer.netlify.app/

###  Overview

CountryExplorer is a React-based web application that allows users to explore information about countries around the world. The application consumes data from the REST Countries API and provides an intuitive interface to search, filter, and view detailed information about different countries.


---

###  Features

-  View a list of all countries with key information
•⁠  ⁠Search for countries by name
•⁠  ⁠Filter countries by region and language
•⁠  ⁠View detailed information about each country
•⁠  ⁠Responsive design for various screen sizes
•⁠  ⁠User authentication and session management
•⁠  ⁠Save favorite countries (for authenticated users)


---

### Technology Stack

•⁠  ⁠*Frontend:* React (Hooks & Functional Components)
•⁠  ⁠*Language:* JavaScript
•⁠  ⁠*Styling:* Tailwind CSS
•⁠  ⁠*State Management:* React Context API
•⁠  ⁠*Testing:* Jest & React Testing Library
•⁠  ⁠*Hosting:* Netlify
•⁠  ⁠*Version Control*: Git/GitHub

---

###  REST Countries API Integration
#### The application integrates with the following endpoints from the REST Countries API:

•⁠  ⁠*GET /all:* Fetch all countries (with caching).
•⁠  ⁠*GET /name/{name}:* Real-time search with debouncing.
•⁠  ⁠*GET /region/{region}:* Filter by continent (with client-side enhancements).
•⁠  ⁠*GET /alpha/{code}:* Rich country details for each country page.
•⁠  ⁠*GET getCountriesByLanguage; countries details for language page.

---

## Setup & Installation
### Prerequisites


#### Clone the repository
git clone: https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-DilshanAnupriya


npm install


#### Start the development server
npm run dev


*App runs at:* http://localhost:5000

---

### Testing

•⁠  ⁠*Run tests:* ⁠ npm test ⁠
•⁠  ⁠Unit, integration, and end-to-end tests included.

---

###  Deployment

•⁠  ⁠*Production build:* ⁠ npm run build ⁠
•⁠  ⁠*Deploy to Netlify:*  
  1. ⁠ npm install -g netlify-cli ⁠  
  2. ⁠ netlify login ⁠  
  3. ⁠ netlify deploy --prod ⁠

---


###  Usage Instructions

#### Browsing Countries

  -  Upon loading the application, you'll see a list of all countries with basic information
    
  -  Use the search bar at the top to search for countries by name
    
  -  Use the region dropdown to filter countries by continent
    
  -  Use the language dropdown to filter countries by spoken languages

#### Viewing Country Details
  -  Click on any country card to view detailed information about that country
    
  -  The details page includes information such as:

            Official name
            
            Population
            
            Area
            
            Capital(s)
            
            Languages
            
            Currencies
            
            Bordering countries
            
            Flag and coat of arms

#### User Authentication
  -  Click on the "Login" button in the top-right corner
    
  -  Enter your credentials or register a new account
    
  -  Once logged in, you can:

          Save countries to your favorites list
          
          View your favorite countries


---
## API Report
### API Selection and Implementation


#### GET /all

Used to fetch the initial list of all countries
Data is cached to improve performance on subsequent visits

#### GET /name/{name}

Implements real-time search functionality
Debouncing is applied to minimize API calls during typing

#### GET /region/{region}

Allows filtering countries by continental regions
Combined with client-side filtering for optimal user experience

#### GET /alpha/{code}

Retrieves detailed information for individual country pages
Includes additional data not available in the basic country list


---
## Challenges and Solutions

*1)Challenge:* Managing large datasets returned by the API

  *Solution:* Implemented pagination and lazy loading to improve performance and reduce initial load time


*2)Challenge:* Handling inconsistent data formats across different countries

*Solution:* Created normalization functions that standardize data before displaying it to the user, ensuring a consistent user experience regardless of data variations


*3)Challenge:* Implementing efficient search across multiple attributes

*Solution:* Developed a client-side search algorithm that filters already-fetched countries when possible, falling back to API search for more comprehensive queries


*4)Challenge:* Maintaining responsive design across various screen sizes

*Solution:* Used Tailwind CSS's responsive utility classes and custom media queries to ensure the application looks good on devices from mobile phones to large desktop screens


*5)Challenge:* Implementing secure user authentication

*Solution:* Created a separate authentication service with JWT tokens and secure storage, implementing proper token refresh mechanisms and session timeout handling