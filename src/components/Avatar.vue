<template>
  <div class="avatar" :style="style">
    <table>
      <tbody>
        <tr>
          <td v-if="!hasImage">{{ initials }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    fullname: { type: String, default: '##' },
    size: { type: Number, default: 48 },
    radius: { type: Number, default: 50, validator: (value) => value >= 0 && value <= 50 },
    image: { type: String, default: '' },
  },
  computed: {
    // compute initials from fullname
    initials () {
      const words = this.fullname.split(/[\s-]+/);
      let intls = '';
      for (let i = 0; i < words.length; i++) {
        intls += words[i].substr(0, 1).toUpperCase();
      }
      if (intls.length > 3) {
        intls = intls.substr(0, 3);
      }
      return intls;
    },
    // compute style from props
    style () {
      const fontSize = this.initials.length > 2 ? this.size / 3 : this.size / 2;
      return {
        'width': this.size + 'px',
        'height': this.size + 'px',
        'border-radius': this.radius + '%',
        'font-size': fontSize + 'px',
        'background-image': this.hasImage ? 'url(' + this.image + ')' : 'none',
      };
    },
    hasImage () {
      return (this.image !== '');
    },
  },
  methods: {
    toColor (str) {
      let hash = 0;
      const len = str.length;
      if (len === 0) return 'black';
      for (let i = 0; i < len; i++) {
        hash = ((hash << 8) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      hash = Math.abs(hash);
      return '#' + hash.toString(16).substr(0, 6);
    },
  },
};
</script>

<style scoped>
  .avatar {
    display: inline-block;
    background-color: #ffffff;
    color: #c7d1d8;
    width: 48px;
    height: 48px;
    font-size: 12px;
    border-radius: 50%;
    border: solid 1px #f4f6f8;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: none;
  }
  .avatar table {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

  }
  .avatar table td{
    text-align: center;
    vertical-align: middle;
  }
  .avatar img {
    width: 100%;
    overflow: hidden;
  }
</style>

