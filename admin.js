import './admin.css';
import $ from 'jquery';
import firebase from 'firebase/app';

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


// Init the dropdown functionality
$('.ui.dropdown').dropdown();

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
            const newProductData = {
                name: $('#name-input').val(),
                description: $('#description-input').val(),
                category: db.doc($('.category.dropdown').dropdown('get value')),
                price: $('#price-input').val(),
            };
            console.debug({newProductData});
            newProductRef = await db.collection("products").add(newProductData);

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

// Launch the modal
$('.product.card').click(function () {
   $('.category.dropdown').dropdown('clear');
    if ($(this).hasClass('new')) {
        $('#image-input').attr('src', "https://via.placeholder.com/300x300?text=%2B");
        $('#name-input').val('');
        $('#description-input').val('');
        $('#price-input').val('');
    } else {
        $('#image-input').attr('src', $(this).find('img').attr('src'));
        $('#name-input').val($(this).find('.name').text().trim());
        $('#description-input').val($(this).find('.description').text().trim());
        $('#price-input').val(parseInt($(this).find('.price').text().trim()));
        $('.category.dropdown').dropdown('set selected', $(this).find('.category').text().trim());
    }
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
