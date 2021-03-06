{
    let view = {
        el: 'section.songs',
        init() {
            this.$el = $(this.el)
        },
        template:`
        <li>
            <h3>{{song.name}}</h3>
            <p>
                <svg class="icon icon-sq">
                    <use xlink:href="#icon-ttpodicon"></use>
                </svg>
                {{song.artist}}
            </p>
            <a class="playButton" href="./song.html?id={{song.id}}">
                <svg class="icon icon-play">
                    <use xlink:href="#icon-bofang"></use>
                </svg>
            </a>
        </li>
        `,
        render(data) {
            let {songs} = data
            songs.map((song) => {
                let $li = $(this.template
                    .replace('{{song.name}}', song.name)
                    .replace('{{song.artist}}', song.artist)
                    .replace('{{song.id}}', song.id)
                )
                this.$el.find('ol.list').append($li)
            })
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song')
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return {
                        id: song.id,
                        ...song.attributes
                    }
                })
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