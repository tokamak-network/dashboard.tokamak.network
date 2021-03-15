<template>
  <div
    class="blockie"
    :style="{
      backgroundImage: `url(${imgURL})`,
      backgroundSize: 'cover',
      width: '30px',
      height: '30px'
    }"
  />
</template>
<script>
import { createIcon } from '../helpers/blockies';
export default {
  name: 'Blockies',
  props: ['address'],
  computed: {
    imgURL () {
      console.log(this.address);
      return createIcon({
        seed: this.address.toLowerCase(),
        size: 8,
        scale: 5,
      }).toDataURL();
    },
  },
};
</script>

<style scoped>
.blockie {
  width: 30px !important;
  height: 30px !important;
  border-radius: 19px;
  margin-right: 10px;
}
</style>
