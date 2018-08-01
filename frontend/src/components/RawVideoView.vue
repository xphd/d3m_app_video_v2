<template>
<div>
    <v-data-table :headers="headers" :items="Videos" :pagination.sync="pagination" hide-actions class="elevation-1">
        <template slot="items" slot-scope="props">
            <td><strong>{{ props.item.id }}</strong></td>
            <td>
                <RawVideoViewSingle :video='props.item' :key="props.item.id"></RawVideoViewSingle>
            </td>
        </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-xs-2"></div>
            <div class="col-xs-4">
                Jump to Page
                <input type="number" min="1" :max="pages" v-model.number="page">
                <button @click="setPage()" class="btn btn-primary btn-sm">Jump!</button>
            </div>
            <div class="col-xs-4">
                Videos Per Page
                <input type="number" min="1" :max="numOfVideoLinks" v-model.number="itemsPerPage">
                <button @click="setItemsPerPage()" class="btn btn-success btn-sm">Go!</button>
            </div>
            <div class="col-xs-2"></div>
        </div>
    </div>
</div>
</template>

<script>
import RawVideoViewSingle from "./RawVideoViewSingle.vue";
export default {
  data: function() {
    return {
      page: 1,
      itemsPerPage: 5,
      pagination: {
        rowsPerPage: 2,
        totalItems: 0
      },
      headers: [
        {
          text: "ID/d3mIndex",
          value: "id",
          align: "left"
        },
        {
          text: "Video Preview",
          value: "link",
          align: "left"
        }
      ],      
      videos: [], // Video objects, {id, VideoLink} where auidoLink is from VideoLinks
      numOfVideos: 0 // number of VideoLinks totally, initialize as 0
    };
  },
  computed: {
    pages() {
      var isRowsPerPageNull = this.pagination.rowsPerPage == null;
      var isTotalItemsNull = this.pagination.totalItems == null;
      if (isRowsPerPageNull || isTotalItemsNull) {
        return 0;
      }
      var totalPages = this.pagination.totalItems / this.pagination.rowsPerPage;
      return Math.ceil(totalPages);
    }
  },
  sockets: {
    connect: function() {
      // console.log("Client: connect to Server");
    },
    // listen for "returnVideoLinks" emmited from backend with data "VideoLinks"
    responseVideoLinks: function(videos) {
      // this.$store.dispatch("updateVideoLinks", VideoLinks); // update data in store
      // this.VideoLinks = this.$store.getters.getVideoLinks; // update data in this vue object
      this.$store.videos = videos;
      this.videos = this.$store.videos;
      this.numOfVideos = this.videos.length; // update numOfVideoLinks
      this.pagination.totalItems = this.numOfVideoLinks;
      // this.loadVideos(this.numOfFirstLoaded); // when get VideoLinks from backend, load some of them
      
    }
  },
  methods: {
    
    setPage() {
      this.pagination.page = this.page;
    },
    setItemsPerPage() {
      this.pagination.rowsPerPage = this.itemsPerPage;
    },
    requestVideoLinks() {
      this.$socket.emit("requestVideos");
    }
  },
  created() {
    this.requestVideos();
    
  },
  components: {
    RawVideoViewSingle
  }
};
</script>

<style scoped>
input {
  text-align: right;
  border: 1px solid gray;
  width: 50px;
}
</style>
