export default {
  created() {
    this._loadContent().then(result =>{
      this._initComponent(result);
      this.hasLoaded = true;
    });
  },
  data(){
    return {
      hasLoaded:false
    }
  },
  methods: {
    _loadContent() {
      return new Promise(function(reslove, reject) {
        setTimeout(() => {
          console.log('resolve in parent async!');
          reslove();
        }, 1000);
      });
    },
    _initComponent(result){
      console.log('init job');
    }
  }
};
