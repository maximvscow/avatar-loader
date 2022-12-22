var resizeableImage = function(image_target) {

    var container,
    orig_src = new Image(),
    event_state = {},
    constrain = false,
    min_width = 60,
    min_height = 60,
    max_width = 800,
    max_height = 900,
    resize_canvas = document.createElement('canvas');

    init = function(e) {
        orig_src.src = image_target.src;
        container =  document.querySelector('.resize-container');
        // container.querySelector('img').addEventListener("mousedown", startMoving);
        container.querySelector('.resize-handle-nw').addEventListener("mousedown", startResize);
        container.querySelector('.resize-handle-ne').addEventListener("mousedown", startResize);
        container.querySelector('.resize-handle-sw').addEventListener("mousedown", startResize);
        container.querySelector('.resize-handle-se').addEventListener("mousedown", startResize);
        //$('.js-crop').on('click', crop);
    }

    startResize = function(e){
        e.preventDefault();
        e.stopPropagation();
        saveEventState(e);
        document.addEventListener("mousemove", resizing);
        document.addEventListener("mouseup", endResize);

    };

    endResize = function(e){
        e.preventDefault();
        document.removeEventListener("mousemove", resizing);
        document.removeEventListener("mouseup", endResize);
    };

    saveEventState = function(e){
        event_state.container_width = container.getBoundingClientRect().width;
        event_state.container_height = container.getBoundingClientRect().height;
        event_state.container_left = container.getBoundingClientRect().left;
        event_state.container_top = container.getBoundingClientRect().top;
        event_state.mouse_x = e.clientX;
        event_state.mouse_y = e.clientY;
        event_state.evnt = e;

  };

  resizing = function(e){
        var mouse={},
        width,
        height,
        left,
        top,
        offset = container.getBoundingClientRect();
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        if( event_state.evnt.target.classList.contains('resize-handle-se') ){
            width = mouse.x - event_state.container_left;
            height = mouse.y  - event_state.container_top;
            left = event_state.container_left;
            top = event_state.container_top;

        } else if(event_state.evnt.target.classList.contains('resize-handle-sw') ){
            width = event_state.container_width - (mouse.x - event_state.container_left);
            height = mouse.y  - event_state.container_top;
            left = mouse.x;
            top = event_state.container_top;
            console.log(event_state.container_width)
        } else if(event_state.evnt.target.classList.contains('resize-handle-nw') ){
            width = event_state.container_width - (mouse.x - event_state.container_left);
            height = event_state.container_height - (mouse.y - event_state.container_top);
            left = mouse.x;
            top = mouse.y;
        if(constrain || e.shiftKey){
            top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
            }
        }
        else if(event_state.evnt.target.classList.contains('resize-handle-ne') ){
            width = mouse.x - event_state.container_left;
            height = event_state.container_height - (mouse.y - event_state.container_top);
            left = event_state.container_left;
            top = mouse.y;
        if(constrain || e.shiftKey){
            top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
            }
        }
        if(constrain || e.shiftKey){
            height = width / orig_src.width * orig_src.height;
        }
        if(width > min_width && height > min_height && width < max_width && height < max_height){
            resizeImage(width, height);
            container.getBoundingClientRect({'left': left, 'top': top});
            }

  }

    resizeImage = function(width, height){
        resize_canvas.width = width;
        resize_canvas.height = height;
        resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);
        resized_img = resize_canvas.toDataURL("image/png");
        image_target.setAttribute("src", resized_img);
    };

    init();

    };

window.addEventListener('load', function() {

    res_image = document.querySelector(".resize-image");

    resizeableImage(res_image);

});


