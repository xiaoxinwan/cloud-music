{
    let view = {
        el:'.page-1',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {

    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventHub()
            this.bindEvents()
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        bindEvents(){}
    }
    controller.init(view, model)
}