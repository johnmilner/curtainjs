window.onload = function(){

    var canvasContainer = document.getElementById("canvas");

    var planes = [];

    var mousePosition = {
        x: 0,
        y: 0,
    };
    var mouseLastPosition = {
        x: 0,
        y: 0,
    };
    var mouseDelta = 0;


    function handleMovement(e, plane) {

        if(mousePosition.x != -100000 && mousePosition.y != -100000) {

            mouseLastPosition.x = mousePosition.x;
            mouseLastPosition.y = mousePosition.y;
        }

        if(e.targetTouches) {

            mousePosition.x = e.targetTouches[0].clientX;
            mousePosition.y = e.targetTouches[0].clientY;
        }
        else {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        }

        if(plane) {
            var mouseCoords = plane.mouseToPlaneCoords(mousePosition.x, mousePosition.y);
            plane.uniforms.mousePosition.value = [mouseCoords.x, mouseCoords.y];

            if(mouseLastPosition.x && mouseLastPosition.y) {
                var delta = Math.sqrt(Math.pow(mousePosition.x - mouseLastPosition.x, 2) + Math.pow(mousePosition.y - mouseLastPosition.y, 2)) / 30;
                delta = Math.min(4, delta);
                if(delta >= mouseDelta) {
                    mouseDelta = delta;
                    plane.uniforms.mouseTime.value = 0;
                }
            }
        }
    }

    var webGLCurtain = new Curtains("canvas");

    var planeElements = document.getElementsByClassName("curtain");

    if(planeElements.length > 0) {

        var planeParams = {
            widthSegments: 50,
            heightSegments: 37,
            //fov: 15,
            imageCover: false,
            uniforms: {
                resolution: {
                    name: "uResolution",
                    type: "2f",
                    value: [planeElements[0].offsetWidth, planeElements[0].offsetHeight],
                },
                mouseTime: {
                    name: "uMouseTime",
                    type: "1f",
                    value: 0,
                },
                mousePosition: {
                    name: "uMousePosition",
                    type: "2f",
                    value: [mousePosition.x, mousePosition.y],
                },
                mouseMoveStrength: {
                    name: "uMouseMoveStrength",
                    type: "1f",
                    value: 0,
                },
            },
        };

        var plane = webGLCurtain.addPlane(planeElements[0], planeParams)

        plane.onReady(function() {
            planeElements[0].classList.add("curtain-ready");
            plane.setPerspective(15);

            var wrapper = document.getElementById("page-wrap");

            wrapper.addEventListener("mousemove", function(e) {
                handleMovement(e, plane);
            });

            wrapper.addEventListener("touchmove", function(e) {
                handleMovement(e, plane);
            });

            window.onresize = function() {
                plane.uniforms.resolution.value = [plane.htmlElement.offsetWidth, plane.htmlElement.offsetHeight];
            }

        }).onRender(function() {
            plane.uniforms.mouseTime.value++;

            plane.uniforms.mouseMoveStrength.value = mouseDelta;
            //smaller ripple movement, .0095 instead of .995
            mouseDelta = Math.max(0, mouseDelta * 0.0095);
        });
    }

}
