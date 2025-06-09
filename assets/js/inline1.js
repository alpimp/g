
    var country_code = getURLParameter('country_code');

    function getURLParameter(name) {
      return decodeURIComponent(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1] || ''
      );
    }

  var DEFAULT_LANGUAGE = 'english';
  var lng = country_code.toLowerCase();
  switch (lng) {
    case 'en':
      lng = 'english';
      break;
    case 'de':
    case 'at':
    case 'li':
    case 'lu':
    case 'ch':
      lng = 'germany';
      break;
    case "fr":
    case 'ch':
    case 'be':
    case 'ga':
    case 'gf':
    case 'gn':
    case 'mc':
      lng = 'france';
      break;
    case 'ar':
    case 'do':
    case 'sv':
    case 've':
    case 'mx':
    case 'co':
    case 'es':
    case 'cr':
    case 'cu':
    case 'pa':
    case 'pe':
    case 'cl':
    case 'ec':
    case 'bo':
    case 'gq':
    case 'gt':
    case 'hn':
    case 'ni':
    case 'py':
    case 'uy':
      lng = 'spain';
      break;
    case 'br':
    case 'pt':
    case 'ao':
      lng = 'portugal';
      break;
    case 'th':
    case 'ph':
      lng = 'thai';
      break;
    case 'dk':
      lng = 'dutch';
      break;
    case 'kr':
      lng = 'korea';
      break;
    case 'jp':
      lng = 'japan';
      break;
    case 'id':
      lng = 'indonesia';
      break;
    case 'no':
      lng = 'norway';
      break;
    case 'it':
      lng = 'italy';
      break;
    case 'se':
      lng = 'sweden';
      break;
    case 'cz':
      lng = 'czech';
      break;
    case 'sk':
      lng = 'slovakia';
      break;
    case 'pl':
      lng = 'poland';
      break;
    case 'eg':
    case 'sa':
    case 'dz':
    case 'ma':
    case 'kw':
    case 'ae':
    case 'bh':
    case 'dj':
    case 'il':
    case 'jo':
    case 'ia':
    case 'ye':
    case 'qa':
    case 'lb':
    case 'sy':
    case 'tn':
    case 'om':
    case 'er':
    case 'so':
    case 'td':
      lng = 'arab';
      break;
    case 'bg':
      lng = 'bulgary';
      break;

    default:
      lng = DEFAULT_LANGUAGE;
  }
  (lng == 'arab') ? document.write('<style>.text_block, .date { direction: rtl; word-wrap: break-word; unicode-bidi: bidi-override} img, .date {display: block;  unicode-bidi:embed ;} .roy { unicode-bidi:embed ;}</style>'): '';

    function go_click() {
        window.location.href = fin_link;
    }

