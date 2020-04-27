<template>
  <div class="navbar">
    <div class="dropdown">
      <button class="dropbtn">
        GUIDE
        <img src="@/assets/images/drop-down-arrow.png" width="10" height="10">
      </button>
      <div class="dropdown-content">
        <a
          target="_blank"
          rel="noopener noreferrer"
          :href="linkForUsage"
        >How to use dashboard?</a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          :href="linkForRegister"
        >How to register node for dashboard?</a>
      </div>
    </div>
  </div>
</template>

<script>
import { getLink } from '../../config.js';

export default {
  data () {
    return {
      linkForRegister: '',
      linkForUsage: '',
    };
  },
  created () {
    this.linkForRegister = getLink('register');
    this.linkForUsage = getLink('use');
  },
};
</script>

<style scoped>
/* Navbar container */
.navbar {
  overflow: hidden;
}

/* Links inside the navbar */
.navbar a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* The dropdown container */
.dropdown {
  float: left;
  overflow: hidden;
}

/* Dropdown button */
.dropdown .dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: #3e3e3e;
  padding: 14px 16px;
  background-color: inherit;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  font-family: inherit; /* Important for vertical align on mobile phones */
  margin: 0; /* Important for vertical align on mobile phones */
}

/* Add a red background color to navbar links on hover */
.navbar a:hover, .dropdown:hover .dropbtn {
  cursor: pointer;
}

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
}

/* Add a grey background color to dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}
</style>
