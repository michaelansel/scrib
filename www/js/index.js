/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var getMousePos = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
var updateIcon = function(icon, p) {
    icon.setAttribute('style', 'position: absolute; left: '+(p.x-45).toString()+'px; top: '+(p.y-45).toString()+'px; width: 90px; height: 90px;');
};
var adjustMouse = function(icon) {
    var el = icon.parentElement;
    var clicked = 0;

    var oldMove = icon.parentElement.onmousemove;
    var oldStop = icon.parentElement.onmouseup;
    var start = function(e) {
        var p = getMousePos(el, e);
        icon.parentElement.onmousemove = move;
        icon.parentElement.onmouseup = stop;
        clicked = 1;
    };
    var move = function(e) {
        if(clicked){
            var p = getMousePos(el, e);
            updateIcon(icon, p);
        }
    };
    var stop = function(e) {
        clicked = 0;
        icon.parentElement.onmousemove = oldMove;
        icon.parentElement.onmouseup = oldStop;
    };
    icon.ondragstart = function() { return false; };
    icon.onmousedown = start;
};

var openNoteEditor = function(icon) {
    icon.noteData = 'img/sample_text.png';
    adjustMouse(icon);
    icon.onclick = showNote.bind(null, icon);
}
var showNote = function(icon) {
    console.log('showing a photo', icon.noteData);
    var img = document.createElement('img');
    img.src = icon.noteData;
    img.setAttribute('style', 'z-index: 15;margin-top:200px;');
    var cover = document.createElement('div');
    cover.setAttribute('style', 'z-index: 14; position: absolute; left:0; right:0; top:0; bottom:0; width: 100%; height: 100%; opacity:0.9; background:rgb(0,0,0);background:rgba(0,0,0,0.9); text-align:center');
    cover.appendChild(img);
    document.body.appendChild(cover);
    cover.onclick = function() {
        document.body.removeChild(cover);
    }
}

var openPhotoPicker = function(icon) {
    icon.photoData = 'img/sample_room.png';
    adjustMouse(icon);
    icon.onclick = showPhoto.bind(null, icon);
}
var showPhoto = function(icon) {
    console.log('showing a photo', icon.photoData);
    var img = document.createElement('img');
    img.src = icon.photoData;
    img.setAttribute('style', 'z-index: 15;margin-top:200px;');
    var cover = document.createElement('div');
    cover.setAttribute('style', 'z-index: 14; position: absolute; left:0; right:0; top:0; bottom:0; width: 100%; height: 100%; background:rgb(0,0,0);background:rgba(0,0,0,0.9); text-align:center');
    cover.appendChild(img);
    document.body.appendChild(cover);
    cover.onclick = function() {
        document.body.removeChild(cover);
    }
}

var iconMouse = function(el, src, callback) {
    var clicked = 0;
    var icon;
    var start = function(e) {
        var p = getMousePos(el, e);
        icon = document.createElement('img');
        icon.src = src;
        el.parentElement.appendChild(icon);
        updateIcon(icon, p);
        clicked = 1;
    };
    var move = function(e) {
        if(clicked){
            var p = getMousePos(el, e);
            updateIcon(icon, p);
        }
    };
    var stop = function(e) {
        clicked = 0;
        icon.classList.add('icon');
        callback(icon);
    };
    el.onmousedown = start;
    el.onmousemove = move;
    el.onmouseup = stop;
};
var drawMouse = function(el) {
    var ctx=el.getContext("2d");
    ctx.strokeStyle = "black";
    var clicked = 0;
    var start = function(e) {
        var rect = el.getBoundingClientRect();
        if(el.getAttribute('width') != rect.width) {
            el.setAttribute('width', rect.width);
        }
        if(el.getAttribute('height') != rect.height) {
            el.setAttribute('height', rect.height);
        }
        
        var p = getMousePos(el, e);
        clicked = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    };
    var move = function(e) {
        if(clicked){
            var p = getMousePos(el, e);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
        }
    };
    var stop = function(e) {
        clicked = 0;
        icon.classList.add('icon');
    };
    el.onmousedown = start;
    el.onmousemove = move;
    el.onmouseup = stop;
};
var removeMouse = function(el) {
    if(!!el) {
        el.onmousedown = undefined;
        el.onmousemove = undefined;
        el.onmouseup = undefined;
    }
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.canvasList = document.getElementsByClassName('drawing-canvas');
        this.setActiveCanvas(0);
        
        var nl = document.getElementsByClassName('sidebar-button')
        var arr = []; for(var i = nl.length; i--; arr.unshift(nl[i]));
        var the_app = this;
        arr.forEach(function(val,idx) {
            val.onclick = function() {
                arr.forEach(function(val) {
                    val.classList.remove('selected');
                });
                the_app.setActiveCanvas(idx);
                val.classList.add('selected');
            };
        });
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        console.log('Received Event: ' + id);
    },
    getActiveCanvas: function() {
        if(this.activeCanvasId>=0) { return this.canvasList[this.activeCanvasId]; }
        console.warn('confused!', this.activeCanvasId);
    },
    setActiveCanvas: function(id) {
        var canvas = this.getActiveCanvas();
        if(!!canvas) {
            removeMouse(this.activeCanvas);
            canvas.parentElement.classList.remove('active');
        }
        this.activeCanvasId = id;
        canvas = this.getActiveCanvas()
        canvas.parentElement.classList.add('active');
        var rect = canvas.getBoundingClientRect();
        if(canvas.getAttribute('width') != rect.width) {
            canvas.setAttribute('width', rect.width);
        }
        if(canvas.getAttribute('height') != rect.height) {
            canvas.setAttribute('height', rect.height);
        }
        switch(id) {
            case 0:
                iconMouse(canvas, 'img/btn_pictureonmap2.png', openPhotoPicker);
                break;
            case 1:
                iconMouse(canvas, 'img/btn_noteonmap.png', openNoteEditor);
                break;
//            case 2:
//                rulerMouse(canvas);
//                break;
            case 3:
                drawMouse(canvas);
                break;
            default:
                drawMouse(this.getActiveCanvas());
        }
    }
};

(function() {

function show_picture_options(){
    $('.selector_pictures').fadeIn();
    $(".selector_notes").hide();
    $(".selector_ruler").hide();
}

function show_notes_options(){
    $(".selector_pictures").hide();
    $(".selector_notes").fadeIn();
    $(".selector_ruler").hide();
}

function show_rulers_options(){
    $('.selector_pictures').hide();
    $('.selector_notes').hide();
    $('.selector_ruler').fadeIn();
}

$(function() {
    $('.pictures').click(show_picture_options);
    $('.notes').click(show_notes_options);
    $('.rulers').click(show_rulers_options);
    $('.drawings').click(show_rulers_options);
});

})();