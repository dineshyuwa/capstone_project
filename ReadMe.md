cd capstone-project

npm install

npm run dev

signup for member

url -> http://localhost:3000/member/createMember

schema like  ->  {
  "firstname":"yuwa",
  "lastname":"dinesh",
  "job":"developer",
  "address":{
    "streetAddress":"91 Scarboro Avenue",
    "city":"Scarborough",
    "state":"Ontario",
    "country":"Canada",
    "postalCode":"M1C 1M5",
    "apartmentNumber":"91"
  },
  "email":"yuwarajalingamd@gmail.com",
  "password":"Dineshrox1233!"
}


login for member

url -> http://localhost:3000/member/login
 
schema like -> {  "email":"yuwarajalingamd@gmail.com",
"hashed_password":"Dineshrox1233!"
}