<div class="ui basic inverted teal segment">
    <nav class="ui secondary icon menu">
        <div class="ui container">
            <span class="header item" href="#">
                <i class="circle notch icon"></i>
                H&L
            </span>
            <span class="item">Admin</span>
            <div class="right floated item">
                {#if loggedin}
                <button id="logout" class="ui basic black button">Logout</button>
                {/if}
            </div>
        </div>
    </nav>
</div>

<main class="products ui container">
    {#await fullname}
    <h1>Loading...</h1>
    {:then name}
    <h1>{name}</h1>
    {:catch error}
    <h1>Error</h1>
    {/await}

    {#if !loggedin}
    <section class="logging-in ui middle aligned center aligned grid">
        <div class="column">
            <h2 class="ui header">
                Log In
            </h2>
            <form class="ui large form">
                <div class="ui stacked segment">
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="user icon"></i>
                            <input id="email" autocomplete="email" type="text" name="email" placeholder="E-mail address">
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input id="password" autocomplete="current-password" type="password" name="password" placeholder="Password">
                        </div>
                    </div>
                    <button class="ui fluid large teal submit button">Login</button>
                </div>
            </form>
        </div>
    </section>
    {:else}
    <div class="ui four doubling link cards">
        <div class="new product card">
            <div class="ui fluid image">
                <img src="https://via.placeholder.com/697x929?text=%2B" alt="New Product">
            </div>
            <div class="content">
                <p class="header">New Product</p>
            </div>
        </div>

        {#each products as product}
        <div class="card">
            <div class="ui fluid image">
                <img src="{product.image}" alt="{product.name}">
            </div>
            <div class="content">
                <p class="header">
                    { product.name }
                </p>
                <p class="price meta">
                    { product.price }
                </p>
            </div>
        </div>
        {/each}
    </div>

    <div class="ui small modal">
        <i class="close icon"></i>
        <div class="header">
            New Product
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field">
                    <img class="ui image" src="https://via.placeholder.com/300x300?text=%2B" alt="Upload">
                    <label for="image-input">Upload image</label>
                    <input id="image-input" type="file" accept="image/jpeg">
                </div>

                <div class="field">
                    <label for="name-input">Product Name</label>
                    <input id="name-input" name="name" type="text">
                </div>
                <div class="field">
                    <label for="description-input">Description</label>
                    <textarea id="description-input" name="description" rows="4"></textarea>
                </div>
                <div class="ui fluid labeled input field">
                    <label for="price-input" class="ui label">$</label>
                    <input id="price-input" type="number" name="price" placeholder="Price">
                </div>
            </div>
        </div>

        <div class="actions">
            <div class="ui buttons">
                <button class="ui cancel button">Cancel</button>
                <div class="or"></div>
                <button class="ui positive approve button">Submit</button>
            </div>
        </div>
    </div>
    {/if}
</main>

<style>
    .products .card .image > img {
        height: 250px;
        max-height: 50vh;
        object-fit: cover;
    }

    .price:before {
        content: '$';
    }

    .logging-in .column {
        max-width: 400px;
    }

</style>

<script>
//webid: https://jshurmer.inrupt.net/profile/card#me

    import $rdf from 'rdflib';
    import sharedNs from 'solid-namespace';
    const ns = sharedNs($rdf);


    // Load the person's data into the store
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);
    const me = $rdf.sym("https://jshurmer.inrupt.net/profile/card/#me");
    const awaitLoad = fetcher.load(me);


    export default  {
        data() {
            return {
                fullname: awaitLoad.then(() => store.any(me, ns.foaf('name'))),
            }
        }
    }
</script>