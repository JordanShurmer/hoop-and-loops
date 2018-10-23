import $ from 'jquery';
import firebase from 'firebase/app';

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyB75AkTLnuLYhRGVVUNb_b2rlzp7wSCSOs",
    authDomain: "hoop-and-loops.firebaseapp.com",
    databaseURL: "https://hoop-and-loops.firebaseio.com",
    projectId: "hoop-and-loops",
    storageBucket: "hoop-and-loops.appspot.com",
    messagingSenderId: "876021813703"
});
// Initialize Cloud Firestore
const db = firebase.firestore();
// Disable deprecated features
db.settings({timestampsInSnapshots: true});

// Initialize Cloud Storage (for files)
const storage = firebase.storage();
const storageRef = storage.ref();


// *******************
// GLOBALS!!!!!!!!!!!!
// *******************
let newProductRef;
let imageFile = {
    ext: undefined,
    file: undefined,
};

// Init the new product modal
$('.ui.modal').modal({
    blurring: true, //looks cool

    // Submit button on modal was clicked
    // * Create new product
    // * Upload image (using id of product)
    // * Refresh products
    // * return true to ensure the modal closes
    async onApprove() {
        try {
            console.debug("Creating empty new product");
            newProductRef = await db.collection("products").add({
                name: $('#name-input').val(),
                description: $('#description-input').val(),
                price: $('#price-input').val(),
            });

            console.debug("Uploading Image to storage");
            const imageRef = storageRef.child(`products/${newProductRef.id}/promo.${imageFile.ext}`);
            const imageSnapshot = await imageRef.put(imageFile.file);//, {contentType: imageFile.file.type})

            const image = await imageRef.getDownloadURL();
            console.debug("Setting image reference on new product", {image});
            await newProductRef.set({image}, {merge: true});

        } catch (reason) {
            console.error("Unable to create product", {reason});
        }
    }
});

// New Product got clicked
// * Launch the modal
$('.new.product.card').click(async function () {
    $('.ui.modal').modal('show');
});


// Image chosen
// * Upload image on selection
// * Render it in the browser
$('#image-input').change(function () {
    imageFile.ext = this.value.split('.').pop(); //file extension (won't handle missing extensions and other things 🤷)
    imageFile.file = this.files[0];
    console.debug({imageFile});

    //Load the image into the browser
    const reader = new FileReader();
    reader.onload = (e) => $(this).siblings('img').attr('src', e.target.result);
    reader.readAsDataURL(imageFile.file);

});


// Logging in logic
$('.logging-in form').submit((event) => {
    event.preventDefault();
    firebase.auth().onAuthStateChanged(user => {
        console.debug("User auth change", {user});
        if (user) {
            user.getIdToken(true).then(token => {
                document.cookie = `__session=${token}`;
                window.location.reload();
            });
        }
    });
    firebase.auth().signInWithEmailAndPassword($('#email').val(), $('#password').val());
});
// Logout logic
$('#logout').click((event) => {
    console.debug("Logging out");
    event.preventDefault();
    firebase.auth().signOut();
    window.location.reload();
    document.cookie = '__session=';
});
