{
    let view = {
        el: 'section.playlists',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <li>
            <a href="./playlist.html?id={{playlists.id}}">
                <div class="cover">
                    <img src="{{playlists.cover}}" alt="封面">
                </div>
                <p>{{playlists.name}}</p>
            </a>
        </li>
        `,
        render(data) {
            let { playlists } = data
            playlists.map((playlist) => {
                let $li = $(this.template
                    .replace('{{playlist.name}}', playlist.name)
                    .replace('{{playlist.artist}}', playlist.artist)
                    .replace('{{playlist.id}}', playlist.id)
                )
                this.$el.find('ol.songs').append($li)
            })
        }

    }
    let model = {
        data = {
            playlists: []
        },
        find() {
            var query = new AV.Query('Playlist')
            return query.find().then((playlists) => {
                this.data.playlists = playlists.map((playlist) => {
                    return {
                        id: playlist.id,
                        ...playlist.attributes
                    }
                })
                return playlists
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