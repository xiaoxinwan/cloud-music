{
    let view = {
        el: '.page > .asideAndMain > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <form class="form">
            <div class="row">
                <label>
                    歌名
                </label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label>
                    歌手
                </label>
                <input name="artist" type="text" value="__artist__">
            </div>
            <div class="row">
                <label>
                    外链
                </label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row">
                <label>
                    封面外链
                </label>
                <input name="cover" type="text" value="__cover__">
            </div>
            <div class="row">
                <label>
                    歌词
                </label>
                <textarea cols=50 rows=10 name="lyric">__lyric__</textarea>
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'url', 'artist', 'id','cover','lyric']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            } else {
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            artist: '',
            url: '',
            id: '',
            cover: '',
            lyric: '',
        },
        update(data) {
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('artist', data.artist)
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyric', data.lyric)       
            console.log(this.data.id)     
            return song.save().then((response) => {
                Object.assign(this.data, data)
                return response
            })
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('artist', data.artist);
            song.set('url', data.url);
            song.set('cover', data.cover)
            song.set('lyric', data.lyric)
                                 
            return song.save().then((newSong) => {
                console.log(newSong)
                let {
                    id,
                    attributes
                } = newSong
                Object.assign(this.data, {
                    id,
                    ...attributes
                })
            }, (error) => {
                console.error(error);
            });
        },
        get(id){
            var query = new AV.Query('Playlist')
            return query.get(id).then((playlist)=>{})
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                if (this.model.data.id) {
                    this.model.data = {
                        name: '',
                        url: '',
                        artist: '',
                        id: '',
                        cover: '',
                        lyric: '',
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
               

                this.view.render(this.model.data)
            })
        },
        create() {
            let needs = 'name artist url cover lyric'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name = "${string}"]`).val()
            })
            this.model.create(data)
                .then(() => {
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create', object)
                })
        },
        update() {
            let needs = 'name artist url cover lyric'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name = "${string}"]`).val()
            })
            this.model.update(data)
                .then(() => {
                    window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
                })
        },
        bindEvents() {
            // this.view.$el.on('text','form',(e)=>{
            //     e.preventDefault()
               
            // }),
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                if(this.model.data.id){
                    this.update()
                }else if(this.model.data.name){
                    this.create()
                }
            })


        },
        getListId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            let array = search.split('&').filter((v => v))
            let id = ''
            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        }
    }
    controller.init(view, model)
}