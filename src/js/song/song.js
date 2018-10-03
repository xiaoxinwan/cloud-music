{
    let view = {
        el: '#app',
        render(data) {
            let { song, status } = data

            $(this.el).find('.bg').css('background', `url(${song.cover})`)
            $(this.el).find('#cover').attr('src', song.cover)
            if ($(this.el).find('audio').attr('src') !== song.url) {
                let audio = $(this.el).find('audio').attr('src', song.url).get(0)
                audio.onended = () => { window.eventHub.emit('songEnd') }
            }
            if (status === 'playing') {
                $(this.el).find('.disc-container').addClass('playing')
            } else {
                $(this.el).find('.disc-container').removeClass('playing')
            }
        },
        play() {
            $(this.el).find('audio')[0].play()
        },
        pause() {
            $(this.el).find('audio')[0].pause()
        }
    }
    let model = {
        data: {
            song: {
                id: '',
                name: '',
                artist: '',
                url: '',
            },
            status: 'playing'
        },
        get(id) {
            var query = new AV.Query('Song')
            return query.get(id).then((song) => {

                Object.assign(this.data.song, { id: song.id, ...song.attributes })
                return song

            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(() => {

                this.view.render(this.model.data)
                this.view.play()
            })
            this.bindEvents()
            window.eventHub.on('songEnd', ()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })

        },
        bindEvents() {
            $(this.view.el).on('click', '.cover', () => {
                this.model.data.status = 'pasued'
                this.view.render(this.model.data)
                this.view.pause()
                console.log(this.model.data.status)
            })
            $(this.view.el).on('click', '.icon-wrapper', () => {
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
                console.log(this.model.data.status)
            })
        },
        getSongId() {
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