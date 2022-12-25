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
        container.querySelector('.resize-image').addEventListener("mousedown", startMoving);
        container.querySelector('.resize-handle-nw').addEventListener("mousedown", startResize);
        container.querySelector('.resize-handle-ne').addEventListener("mousedown", startResize);
        container.querySelector('.resize-handle-sw').addEventListener("mousedown", startResize);
        container.querySelector('.resize-handle-se').addEventListener("mousedown", startResize);
        document.querySelector('.js-crop').addEventListener("click", crop);
        document.querySelector('.btn-input').addEventListener("click", fileUpload);
        document.querySelector('.btn-cam').addEventListener("click", webcamStart);
        document.querySelector('.btn-snapshot').addEventListener("click", makeSnapshot);

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
        // console.log(event_state)
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
            console.log(top)
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
            // container.style.left = left + 'px';
            // container.style.top = top + 'px';
            }

  }

    resizeImage = function(width, height){
        resize_canvas.width = width;
        resize_canvas.height = height;
        resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);
        //console.log(orig_src, 0, 0, width, height)
        resized_img = resize_canvas.toDataURL("image/png");
        image_target.setAttribute("src", resized_img);
    };

    startMoving = function(e){
        e.preventDefault();
        e.stopPropagation();
        saveEventState(e);
        document.addEventListener("mousemove", moving);
        document.addEventListener("mouseup", endMoving);
    };

    endMoving = function(e){
        e.preventDefault();
        document.removeEventListener("mousemove", moving);
        document.removeEventListener("mouseup", endMoving);
    };

    moving = function(e){
        var  mouse={};
        e.preventDefault();
        e.stopPropagation();
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        container.style.left = (mouse.x - event_state.mouse_x) + 'px'; // (event_state.mouse_x - event_state.container_left)
        container.style.top = (mouse.y - event_state.mouse_y) + 'px'; // (event_state.mouse_y - event_state.container_top)
    };

    crop = function(){
    //Find the part of the image that is inside the crop box
        var crop_canvas,
        overlay_pic = document.querySelector('.overlay');
        left = overlay_pic.getBoundingClientRect().left - container.getBoundingClientRect().left,
        top1 =  overlay_pic.getBoundingClientRect().top - container.getBoundingClientRect().top,
        width = overlay_pic.getBoundingClientRect().width,
        height = overlay_pic.getBoundingClientRect().height;

        crop_canvas = document.createElement('canvas');
        crop_canvas.width = width;
        crop_canvas.height = height;

        crop_canvas.getContext('2d').drawImage(image_target, left, top1, width, height, 0, 0, width, height); // , 0, 0, width, height
        cropped_img = crop_canvas.toDataURL("image/png");
        avatar = document.querySelector('.avatar');
        avatar.setAttribute("src", cropped_img);

    };

    init();

    };

fileUpload = function() {
        input = document.querySelector('.input');
        container =  document.querySelector('.resize-container');
        input.click();
        input.addEventListener('change', () => {
            img1 = input.files[0]
            reader = new FileReader();
            reader.onload = function (e) {
                target_image = container.querySelector('.resize-image');
                target_image.setAttribute("src", e.target.result);
                e.target.result
                resizeableImage(target_image);
            }
            src1 = reader.readAsDataURL(img1);
        // input.removeEventListener('change');
        });

    };

webcamStart = function() {
        var video = document.querySelector(".video");

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (err0r) {
                console.log("Something went wrong!");
            });

        document.querySelector(".btn-snapshot").style.visibility = "visible";
}
}

makeSnapshot = function() {
        video = document.querySelector(".video");
        width = video.getBoundingClientRect().width;
        height = video.getBoundingClientRect().height;
        console.log(width, height);
        container =  document.querySelector('.resize-container');
        snapshot_canvas = document.createElement('canvas');
        snapshot_canvas.height = height;
        snapshot_canvas.width = width;
        snapshot_canvas.getContext('2d').drawImage(video, 0, 0, width, height);
        snapshot = snapshot_canvas.toDataURL("image/png");
        target_image = container.querySelector('.resize-image');
        target_image.setAttribute("src", snapshot);
        resizeableImage(target_image);
}

window.addEventListener('load', function() {

    res_image = document.querySelector(".resize-image");
    resizeableImage(res_image);

});


