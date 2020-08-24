/////////////////// FIREBASE CONFIG //////////////////////

// Project settings
let config = {
  apiKey: 'AIzaSyBg4YKpUQIyLeR_luhcmoJnRZWH65sD5oU',
  authDomain: 'wmdd-b6d1f.firebaseapp.com',
  databaseURL: 'https://wmdd-b6d1f.firebaseio.com',
  projectId: 'wmdd-b6d1f',
  storageBucket: 'wmdd-b6d1f.appspot.com',
  messagingSenderId: '549717994968',
  appId: '1:549717994968:web:fe2471d22da07c8c0e56ad',
  measurementId: 'G-17FJL464CX',
}

//Initialize firebase with your project config

// if (!firebase.apps.length) {
//   firebase.initializeApp(config)
// }
firebase.initializeApp(config)

// Initialize Cloud Firestore through Firebase
let db = firebase.firestore()

//////////////// VARIABLES DECLARATION ////////////////////

let email = document.getElementById('email').value
let password = document.getElementById('password').value
let signUp = document.getElementById('sign-up')
let signIn = document.getElementById('sign-in')
let signOut = document.getElementById('sign-out')
let addButton = document.getElementById('addBtn')

////////////////// EVENT LISTENERS //////////////////////

signUp.addEventListener('click', sUp)
signIn.addEventListener('click', sIn)
signOut.addEventListener('click', sOut)

//////////////// FUNCTIONS DECLARATIONS ////////////////

//sign-up function
function sUp() {
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      $('#msg').html('You account was created. Please Sign In')
    })
    .catch(function (error) {
      console.log(error.code)
      console.log(error.message)
      $('#msg').html(error.message)
    })
  //console.log(email);
}

// sign-in function
function sIn() {
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      $('#msg').html('You are logged-in')
      console.log('User logged-in')
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      console.log(errorCode)
      console.log(errorMessage)
      $('#msg').html(errorMessage + 'Or please try to Sign Up first.')
    })
  $('#todo').css('display', 'block')
}

// sign-out function
function sOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      $('#msg').html('You are logged-out')
      console.log('User Logged Out!')
    })
    .catch(function (error) {
      // An error happened.
      console.log(error)
    })
  $('#todo').css('display', 'none')
}

//get user state
function state() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      $('#todo').css('display', 'block')
    } else {
      $('#todo').css('display', 'none')
    }
  })
}

//get details from user
function getDetails() {
  var user = firebase.auth().currentUser
  if (user) {
    // User is signed in.
    if (user != null) {
      name = user.displayName
      email = user.email
      photoUrl = user.photoURL
      emailVerified = user.emailVerified
      uid = user.uid
      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }
  } else {
    // No user is signed in.
  }
}

/////////////////// UPLOAD FILE /////////////////////

// Initialize Firebase
// firebase.initializeApp(config)
//firebase storge has buckets
/* we put specific rule to allow read/write in /playcode dir within bucket
     match /playcode/{allPaths=**} {
      allow read, write;
    }
  */

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage()

//discoverd from uploaded files
var base = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/`

var selectedFile
//this is handler for input to store file info (used in upload button handler)
$('#file').on('change', function (event) {
  console.log(event.target)
  selectedFile = event.target.files[0]
  console.log(selectedFile.name)
  $('#outcome').html('') //clear message area
  $('#img').attr('src', '') //clear image
})

$('#uploadBtn').click(function (event) {
  console.log('here')
  console.log(event.target)
  if (!selectedFile) {
    $('#outcome').html('First select a file')
    return
  }

  var storage = firebase.storage()
  var imageRef = storage.ref().child('/playcode/' + selectedFile.name)
  var uploadTask = imageRef.put(selectedFile) //actual upload

  uploadTask.then(function (snapshot) {
    console.log(snapshot.metadata)
    /*
      imageRef.getMetadata().then(function(meta) {
        console.log("meta:" +JSON.stringify(meta));// it's the same as metadata in snapshot
      });
*/
    let src =
      base + encodeURIComponent(snapshot.metadata.fullPath) + '?alt=media'
    $('#outcome').html('Upload! : ' + snapshot.state + '<BR> Location : ' + src)
    $('#img').attr('src', src)
  })
  uploadTask.catch(function (err) {
    console.log('failed to upload blob or file!' + JSON.stringify(err))
  })
})
