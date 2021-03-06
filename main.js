var eventBus = new Vue();

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
  `
});

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  
  <div class="product">
  <div class="product-image">
        <img v-bind:src="image" alt="">
      </div>

      <div class="product-info">
          <h1>{{ product }}</h1>
          <p v-if="inStock">In Stock</p>
          <p v-else>Out of Stock</p>
          <p>Shipping: {{ shipping }}</p>

          <product-details :details="details"></product-details>


        <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
          :style="{ backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">
        </div>


        <button v-on:click="addTocart" :disabled="!inStock" :class="{ disabledButton: !inStock}">Add to Cart</button>

        <button v-on:click="minusTocart">Delete Cart</button>

        <product-tabs :reviews="reviews"></product-tabs>




        
        </div>

      </div>
  `,
  data() {
    return {
      brand: 'Adidas',
      product: 'Socks',
      selectedVariant: 0,
      link: 'http://youtube.com',
      onSale: true,
      inventory: 2,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: './vmSocks.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: './vmSocks-blue.jpg',
          variantQuantity: 0
        }
      ],
      reviews: []
    };
  },
  methods: {
    addTocart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    minusTocart() {
      this.$emit(
        'minus-to-cart',
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct(index) {
      this.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return this.brand + ' ' + this.product + ' are on sale!';
      }
      return this.brand + ' ' + this.product + ' are not on sale!';
    },
    shipping() {
      if (this.premium) {
        return 'Free';
      }
      return '$2.99';
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    });
  }
});

Vue.component('product-review', {
  template: `
   <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
      <b>Please correct the following error(s)</b>
      <ul>
       <li v-for="error in errors">{{ error }}</li>
      </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
      <label for="recommend">Would you recommend thids product?
      <select id="recommend" v-model.text="recommend">
      <option>Yes</option>
      <option>No</option>
      </select>
      </label>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.rating && this.review && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        eventBus.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push('Name required.');
        if (!this.review) this.errors.push('Review required.');
        if (!this.rating) this.errors.push('Rate required.');
        if (!this.recommend) this.errors.push('Recommendation required.');
      }
    }
  }
});

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
  <div>
    <span class="tab"
          :class="{ activeTab: selectedTab === tab }" 
          v-for="(tab, index) in tabs" 
          :key="index"
          @click="selectedTab = tab">
          {{ tab }}</span>



        <div v-show="selectedTab === 'Reviews'">
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>

        <ul>

          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating}}</p>
          <p>Review: {{ review.review}}</p>
           <p>Are you recommended?{{ review.recommend }}</p>
          </li>

        </ul>
        
        </div>


        <product-review v-show="selectedTab === 'Make a review'"></product-review>
  </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a review'],
      selectedTab: 'Reviews'
    };
  }
});

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    minusCart(id) {
      this.cart.pop(id);
    }
  }
});
