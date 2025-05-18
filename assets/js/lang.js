$.i18n().load({
    en: {
        congratulations: 'Congratulations! 🎉',
        win: 'You have a chance to win.',
        message: `You have been selected for a chance to win an Apple iPhone 16 Pro.
Register before the timer runs out.
<strong>The sooner you register, the better your chances of winning!</strong>`,
        hurryUp: `Hurry 🔥 before it's over!`,
        button: 'Continue'
    },
    id: {
        congratulations: 'Selamat! 🎉',
        win: 'Anda memiliki kesempatan untuk menang.',
        message: `Anda telah dipilih untuk mendapatkan kesempatan memenangkan Apple iPhone 16 Pro.
Daftar sebelum waktu habis.
<strong>Semakin cepat Anda mendaftar, semakin besar peluang Anda untuk menang!</strong>`,
        hurryUp: `Cepat 🔥 sebelum kesempatan ini berakhir!`,
        button: 'Lanjutkan'
    }
})
.done(function () {

    // --- Global Variables ---
    let geoCountryCode = 'us'; // Fallback country code
    let geoLocale = 'en';      // Fallback locale

    // --- Mapping of country codes to supported locales ---
    const countryToLocale = {
        'ID': 'id',
        'US': 'en',
        'SG': 'en',
        'PH': 'en',
        // Add more as needed
    };

    // --- Fetch Geo Location via IP API ---
    function detectGeoLocation() {
        $.getJSON('https://ipapi.co/json/ ')
            .done(function (response) {
                const countryCode = response.country_code || 'US';
                geoCountryCode = countryCode.toUpperCase();

                // Map country code to locale
                geoLocale = countryToLocale[geoCountryCode] || 'en';

                // Set locale and flag image
                i18n_set_locale(geoLocale);
                set_geo_flag(geoCountryCode.toLowerCase());

                // Optional: expose globally
                window.geoCountryCode = geoCountryCode;
                window.geoLocale = geoLocale;

                console.log('Detected Country Code:', geoCountryCode);
                console.log('Detected Locale:', geoLocale);

            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.warn('IP geolocation failed. Using fallback: US');
                geoCountryCode = 'US';
                geoLocale = 'en';
                i18n_set_locale(geoLocale);
                set_geo_flag('us');
                window.geoCountryCode = 'US';
                window.geoLocale = 'en';
            });
    }

    // --- i18n Translation Setup (unchanged) ---
    function i18n_set_locale(locale = '') {
        if (locale) {
            $.i18n().locale = locale;
        }
        $('html').i18n();
        $('input[placeholder][data-i18n]').each(function () {
            $(this).prop('placeholder', $.i18n($(this).data('i18n')));
        });
    }

    // --- Flag Image Setup ---
    function set_geo_flag(countryCode) {
        $('#geo-flag').attr('src', `/img/${countryCode}.jpg`);
    }

    // --- Start Geo Detection ---
    detectGeoLocation();

});
