<template>
  <div class="counter-wrapper">
    <div v-if="ready" id="counter" class="animated">
      <ul v-for="(item, index) in splitedTotalStaked" :key="index" class="digits digits-first rolling" :style="{'animation-delay': `${(splitedTotalStaked.length - index) * 0.2}s`, }">
        <li v-for="num in 21" :key="num">
          {{ num !== 21 ?
            Math.floor(Math.random() * 10) : item }}
        </li>
      </ul>
    </div>
    <div v-else id="counter" class="animated">
      <ul class="unit"><li> 0 </li></ul>
    </div>
    <span class="unit">TON</span>
  </div>
</template>

<script>
export default {
  props: {
    totalSupply: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      splitedTotalStaked: this.totalSupply.toLocaleString(undefined, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }),
      ready: false,
    };
  },
  mounted () {
    setTimeout(()=>{
      this.ready = true;}
    , 100);
  },
};

</script>

<style scoped>
.counter-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 500px;
}
#counter {
    height: 50px;
    overflow: hidden;
}
ul {
    padding-left: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
}
li {
    margin-left: 0px;
}
.digits {
    float:left;
    list-style-type: none;
    font-size: 50px;
    line-height: 1em;
    font-weight: 600;
    font-family: "Titillium Web", sans-serif;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: 1.25px;
    text-align: center;
    color: #2a72e5;
    visibility: hidden;
}
.digits-first {
    margin-top: 0em; /* number 4! */
}

.digits {
    animation-duration: 1.5s;
    animation-timing-function: ease;
    /* animation-delay: 1.5s; */
    animation-fill-mode: forwards;
}

.rolling {
    animation-name: rolling;
}
/* Animations */
@keyframes rolling {
    100% {
        visibility: visible;
        margin-top: -1000px;
    }
}
.unit {
    margin-left: 20px;
     float:left;
    list-style-type: none;
    font-size: 50px;
    line-height: 1em;
    font-weight: 600;
    font-family: "Titillium Web", sans-serif;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: 1.25px;
    text-align: center;
    color: #2a72e5;
}
</style>
