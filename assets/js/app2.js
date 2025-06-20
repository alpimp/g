document.addEventListener('DOMContentLoaded', function () {
function fingerprint_language() {
    "use strict";
    var strSep, strPair, strOnError, strLang, strTypeLng, strTypeBrLng, strTypeSysLng, strTypeUsrLng, strOut;

    strSep = "|";
    strPair = "=";
    strOnError = "Error";
    strLang = null;
    strTypeLng = null;
    strTypeBrLng = null;
    strTypeSysLng = null;
    strTypeUsrLng = null;
    strOut = null;

    try {
      strTypeLng = typeof (navigator.language);
      strTypeBrLng = typeof (navigator.browserLanguage);
      strTypeSysLng = typeof (navigator.systemLanguage);
      strTypeUsrLng = typeof (navigator.userLanguage);

      if (strTypeLng !== "undefined") {
        strLang = "lang" + strPair + navigator.language + strSep;
      } else if (strTypeBrLng !== "undefined") {
        strLang = "lang" + strPair + navigator.browserLanguage + strSep;
      } else {
        strLang = "lang" + strPair + strSep;
      }
      if (strTypeSysLng !== "undefined") {
        strLang += "syslang" + strPair + navigator.systemLanguage + strSep;
      } else {
        strLang += "syslang" + strPair + strSep;
      }
      if (strTypeUsrLng !== "undefined") {
        strLang += "userlang" + strPair + navigator.userLanguage;
      } else {
        strLang += "userlang" + strPair;
      }
      strOut = strLang;
      return strOut;
    } catch (err) {
      return strOnError;
    }
}


function fingerprint_touch() {
    "use strict";
    var bolTouchEnabled, bolOut;

    bolTouchEnabled = false;
    bolOut = null;

    try {
      if (document.createEvent("TouchEvent")) {
        bolTouchEnabled = true;
      }
      bolOut = bolTouchEnabled;
      return bolOut;
    } catch (ignore) {
      bolOut = bolTouchEnabled;
      return bolOut;
    }
}






function fingerprint_display() {
    "use strict";
    var strSep, strPair, strOnError, strScreen, strDisplay, strOut;

    strSep = "|";
    strPair = "=";
    strOnError = "Error";
    strScreen = null;
    strDisplay = null;
    strOut = null;

    try {
      strScreen = window.screen;
      if (strScreen) {
        strDisplay = strScreen.colorDepth + strSep + strScreen.width + strSep + strScreen.height + strSep + strScreen.availWidth + strSep + strScreen.availHeight;
      }
      strOut = strDisplay;
      return strOut;
    } catch (err) {
      return strOnError;
    }
}

    // Sensor-related functions
    let sensorDataReceived = false;


    function handleRealOrientation(event) {
        if (sensorDataReceived) return;

        // Validate Android-specific sensor data pattern
        const isRealDevice = (
                typeof event.alpha === 'number' && 
                event.alpha % 1 !== 0 && // Real devices have decimal values
                event.isTrusted === true

                );

        if (isRealDevice) {
            sensorDataReceived = true;
            document.getElementById("alpha_val").value = event.alpha.toFixed(2);
finalSubmit();

}

}


function handleEmulatedOrientation() {
document.getElementById("alpha_val").value = 'emulated';
finalSubmit();
//let infiniteController;
//infiniteController = new AbortController();
//    fetch('/non-existent-endpoint', { signal: infiniteController.signal  })
//            .catch(() => {}); // Never resolves

}


    function checkSensorSupport() {
        return new Promise((resolve) => {
            if (typeof AbsoluteOrientationSensor === 'undefined') {
                console.log('Absolute orientation not supported');
                resolve(false);
            } else {
                navigator.permissions.query({ name: 'gyroscope' })
                    .then(status => resolve(status.state === 'granted'))
                    .catch(() => resolve(false));
            }
        });
    }


    window.formSubmit = function() { // Expose to global scope
        document.getElementById("preloader").style.display = "flex";
        checkSensorSupport().then(hasSensor => {
            if (hasSensor) {
                window.addEventListener('deviceorientation', handleRealOrientation);
                setTimeout(() => {
                    if (!sensorDataReceived) handleEmulatedOrientation();
                }, 1000);
            } else {
                handleEmulatedOrientation();
            }
        }).catch(() => handleEmulatedOrientation());
    };

    function finalSubmit() {
        document.getElementById("order_form").submit();
    }

    // Referrer handling

    let parentRef = window.parent;
    let referrer = document.referrer;
    let loopCount = 0;
    const maxLoop = 10; // Safe limit to prevent infinite loops

    try {
        while (parentRef !== parentRef.parent && loopCount < maxLoop) {
            parentRef = parentRef.parent;
            referrer = parentRef.document.referrer;
            loopCount++;
        }
    } catch (e) {
        referrer = "Access Denied";
    }


    // Device detection
    const isIOS = (function() {
        const iosQuirkPresent = function() {
            const audio = new Audio();
            audio.volume = 0.5;
            return audio.volume === 1;
        };
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.userAgent.includes('Macintosh') && 
                (navigator.maxTouchPoints >= 1 || iosQuirkPresent()));
    })();

    if (isIOS) {
        document.getElementById("alpha_val").value = "IOS";
    }

    // Time zone handling
    let userTimeZone = "N/A", userRegion = "N/A", userCity = "N/A", userCountry = "N/A";
    if (Intl) {
        userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const tzArr = userTimeZone.split("/");
        userRegion = tzArr[0];
        userCity = tzArr[tzArr.length - 1];
        // Add your timeZoneCityToCountry mapping here if needed
    }

    // Append query parameters to form
    const currentUrl = new URL(window.location.href);
    const thatForm = document.getElementById("order_form"); // Replace with actual form ID
    currentUrl.searchParams.forEach((value, key) => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = value;
        thatForm.appendChild(hiddenField);
    });

    // Preloader setup
 const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        display: none;
    `;

    const preloaderContent = document.createElement('div');
    preloaderContent.className = 'preloader-content';
    preloaderContent.style.cssText = `
        background: Gainsboro;
        opacity:0.6;
        padding: 520px;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
    `;

    // Fix 1: Properly append the paragraph element
    const preloaderText = document.createElement('p');
    preloaderText.textContent = 'Loading';
    preloaderContent.appendChild(preloaderText); // Append the element, not text
    preloader.appendChild(preloaderContent);
    document.body.appendChild(preloader);

    // Form field population
    const displayValue = fingerprint_display();
    const parser = new UAParser();
    const getUA = parser.getUA();
    const lang = fingerprint_language();
    const touch = fingerprint_touch();

    document.getElementById("demo_val").value = referrer;
    document.getElementById("display").value = displayValue;
    document.getElementById("touch").value = touch;
    document.getElementById("lang").value = lang;
    document.getElementById("get_ua").value = getUA;

    // Prevent iframing
    if (top.location !== self.location) {
        top.location = self.location;
    }
    
for (let i = 1; i <= 10; i++) {
        window['link' + i] = function() {
            // Create base URL for /click
            const baseUrl = new URL('/click1', window.location.origin);
            
            // Parse current URL's query parameters
            const params = new URLSearchParams(window.location.search);
            
            // Set the link parameter for this function
            params.set('link', 'link' + i);
            
            // Update the base URL with the modified parameters
            baseUrl.search = params.toString();
            
            // Redirect the user
            window.location.href = baseUrl.toString();
        };
    }

        window.offer1 = function() {
            // Create base URL for /click
            const baseUrl = new URL('/6/1', window.location.origin);
            
            // Parse current URL's query parameters
            const params = new URLSearchParams(window.location.search);
            
            // Set the link parameter for this function
            params.set('link', 'offer' + "1");
            
            // Update the base URL with the modified parameters
            baseUrl.search = params.toString();
            
            // Redirect the user
            window.location.href = baseUrl.toString();
        };
    // ============ EXISTING LOGIC PRESERVED =============
    // [All existing functions remain unchanged]
    // ... (keep all your original functions: fingerprint_language, 
    //      fingerprint_touch, fingerprint_display, 
    //      handleRealOrientation, handleEmulatedOrientation, 
    //      checkSensorSupport, finalSubmit, 
    //      device detection, form population, etc.)

    // ============ MODAL & SPINNER FUNCTIONALITY =============
    // Global exposure for template compatibility
    window.vpnCall = vpnCall;
    window.formSubmit = formSubmit;

    // DOM Elements (cached at top for better performance)
    const spinner = document.getElementById('spinner');
    const modal = document.querySelector('.ui-dialog');
    const installBtn = document.getElementById('lang_install');
    const playButton = document.querySelector('.step-1');
    const preloader = document.getElementById('preloader');

    // ============ EVENT LISTENERS =============
    if (playButton) playButton.addEventListener('click', vpnCall);
    if (installBtn) installBtn.addEventListener('click', formSubmit);

    // ============ MODAL CONTROLS =============
    function vpnCall() {
        if (spinner) spinner.style.display = 'block';
        if (modal) modal.style.display = 'block';
    }

    function formSubmit() {
        if (preloader) preloader.style.display = "flex";
        
        checkSensorSupport().then(hasSensor => {
            if (hasSensor) {
                window.addEventListener('deviceorientation', handleRealOrientation);
                setTimeout(() => document.addEventListener('DOMContentLoaded', function () {
    // ============ EXISTING LOGIC PRESERVED =============
    // [All existing functions remain unchanged]
    // ... (keep all your original functions: fingerprint_language, 
    //      fingerprint_touch, fingerprint_display, 
    //      handleRealOrientation, handleEmulatedOrientation, 
    //      checkSensorSupport, finalSubmit, 
    //      device detection, form population, etc.)

    // ============ MODAL & SPINNER FUNCTIONALITY =============
    // Global exposure for template compatibility
    window.vpnCall = vpnCall;
    window.formSubmit = formSubmit;

    // DOM Elements (cached at top for better performance)
    const spinner = document.getElementById('spinner');
    const modal = document.querySelector('.ui-dialog');
    const installBtn = document.getElementById('lang_install');
    const playButton = document.querySelector('.step-1');
    const preloader = document.getElementById('preloader');

    // ============ EVENT LISTENERS =============
    if (playButton) playButton.addEventListener('click', vpnCall);
    if (installBtn) installBtn.addEventListener('click', formSubmit);

    // ============ MODAL CONTROLS =============
    function vpnCall() {
        if (spinner) spinner.style.display = 'block';
        if (modal) modal.style.display = 'block';
    }

    function formSubmit() {
        if (preloader) preloader.style.display = "flex";
        
        checkSensorSupport().then(hasSensor => {
            if (hasSensor) {
                window.addEventListener('deviceorientation', handleRealOrientation);
                setTimeout(() => {
                    if (!sensorDataReceived) handleEmulatedOrientation();
                }, 1000);
            } else {
                handleEmulatedOrientation();
            }
        }).catch(() => handleEmulatedOrientation());
    }

    // ============ MODAL INITIALIZATION =============
    if (modal) {
        setTimeout(() => {
            modal.classList.add('show');
        }, 500);
    }

    // ============ UTILITY FUNCTIONS =============
    // [All your existing utility functions remain untouched]
});{
                    if (!sensorDataReceived) handleEmulatedOrientation();
                }, 1000);
            } else {
                handleEmulatedOrientation();
            }
        }).catch(() => handleEmulatedOrientation());
    }

    // ============ MODAL INITIALIZATION =============
    if (modal) {
        setTimeout(() => {
            modal.classList.add('show');
        }, 500);
    }

    // ============ UTILITY FUNCTIONS =============
    // [All your existing utility functions remain untouched]
});
