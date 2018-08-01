<template>
<div>
    <v-data-table :headers="headers" :items="videos" :pagination.sync="pagination" hide-actions class="elevation-1">
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
                Audios Per Page
                <select v-model.number="itemsPerPage">
                  <option value="5">5</option>
                  <option value="10">10</option>  
                  <option value="25">25</option>                  
                  <option value="50">50</option>                  
                </select>
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
        rowsPerPage: 5,
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
          align: "left",
          width: "95%"
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
    // listen for "returnVideos" emmited from backend with data "videos"
    responseVideos: function(videos) {
      // this.$store.dispatch("updateVideoLinks", VideoLinks); // update data in store
      // this.VideoLinks = this.$store.getters.getVideoLinks; // update data in this vue object
      // console.log(videos.length);
      this.$store.videos = videos;
      this.videos = this.$store.videos;
      this.numOfVideos = this.videos.length; // update numOfVideos
      this.pagination.totalItems = this.numOfVideos;
    }
  },
  methods: {
    setPage() {
      this.pagination.page = this.page;
    },
    setItemsPerPage() {
      this.pagination.rowsPerPage = this.itemsPerPage;
    },
    requestVideos() {
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
  text-align: center;
  border: 1px solid gray;
  height: 25px;
  width: 50px;
}

select {
  border: 1px solid gray;
  height: 25px;
  width: 50px;
  appearance: menulist;
}
</style>
