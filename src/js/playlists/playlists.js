{
    let view = {
        el: '.playlist',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <li>
            <div class="number">$</div>
            <div class="song">
                <div class="song-wrapper">
                    <div class="name">{{song.name}}</div>
                    <div class="artist">{{song.artist}}</div>
                </div>
                <a class="touch-icon" href="./song.html?id={{song.id}}">
                <svg class="icon icon-play">
                    <use xlink:href="#icon-bofang"></use>
                </svg>
            </a>
            </div>
        </li>
        `,
        render(data) {
            let { songs } = data
            songs.map((song) => {
                let $li = $(this.template
                    .replace('{{song.name}}', song.name)
                    .replace('{{song.artist}}', song.artist)
                    .replace('{{song.id}}', song.id)
                )
                this.$el.find('.songlists > ul').append($li)
            })
        }
    }

    let model = {
        data: {
            songs: [],
            playlists: []
        },
        find() {
            var queryPlaylist = new AV.Query('Playlist')
            return queryPlaylist.find().then((playlists)=>{
                return {
                    id: playlists.id,
                }
                return playlists
            })
            var querySong = new AV.Query('Song')
            return querySong.find().then((songs) => {
                if (songs.dependent.id === playlists.id) {
                    this.data.songs = songs.map((song) => {
                        return {
                            id: song.id,
                            ...song.attributes
                        }
                    })
                }
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}