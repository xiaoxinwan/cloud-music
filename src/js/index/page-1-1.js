{
    let view = {
        el:'section.playlists',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {

    }
    let controller = {
        init(view, model){
            this.view = view 
            this.model = model
            this.view.init()

        }
    }
    controller.init(view, model)
}