export async function onRequest(context) {
  const { request, env } = context;
  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('Error parsing form data:', error);
    formData = new FormData(); // Default to empty
  }

  const url = new URL(request.url);
  const pparams = url.searchParams;

  const ref = request.headers.get('referer') || '';
  const country_code = request.cf?.country ?? 'Unknown';
  const tz = request.cf?.timezone ?? 'Unknown';
  const asn = request.cf?.asn ?? 'Unknown';
  const accel = formData.get("alpha_val") || 'Unknown';
  const touch = formData.get("touch") || 'Unknown';
  const display = formData.get("display") || 'Unknown';
  const ua = formData.get("get_ua") || 'Unknown';

  const ip1 = request.headers.get("Cf-Connecting-Ip");
  const ip = ip1 || "";
  const date = new Date();
  const dt = date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  console.log('Submitting Form Results...');
  await handleFormSubmit(ref, ip, dt, tz, asn, country_code, accel, touch, display, ua, env);

    if (url.href.toLowerCase().includes('bemob')) {
        const html = `
            <!DOCTYPE html>
                <html>
                <head>
                  <meta http-equiv="refresh" content="0;url=https://3ye4x.bemobtrcks.com/click">
                </head>
                <body>Redirecting...</body>
                </html>
              `;
        return new Response(html, {
            status: 200,
                headers: { 'Content-Type': 'text/html'  }
              
          });
    }




    



  // Default fallback URL
  let destinationURL = "https://skrotrack.com/click";

  // Hardcoded link-to-URL mapping
  const linkMap = {
    'link1': 'https://www.hundtoller.top/f/0784e454-828e-4b80-a5ca-a5d95c94eff4', 
    'link2': 'https://www.hundtoller.top/f/18b11677-6d62-42f2-be1c-9696b50dc6f3', 
    'link3': 'https://www.hundtoller.top/f/30225bd3-f94b-4e75-8af9-565e557fa224', 
    'link4': 'https://www.hundtoller.top/f/0cd6772a-7986-4a33-88cc-f0e22079470a', 
    'link5': 'https://www.hundtoller.top/f/5d465e4a-c885-4145-931b-ad2202163e9e', 
    'link6': 'https://github.com', 
    'link7': 'https://stackoverflow.com', 
    'link8': 'https://news.ycombinator.com', 
    'link9': 'https://reddit.com', 
    'link10': 'https://3ye4x.bemobtrcks.com/click' 
  };

  // Check for 'link' parameter in query string
  const linkParam = pparams.get('link');
  if (linkParam && linkMap.hasOwnProperty(linkParam)) {
    destinationURL = linkMap[linkParam];
    pparams.delete('link'); // Remove internal routing param before redirect
  }


  // Append remaining query parameters
  if (pparams.toString()) {
    destinationURL += '?' + pparams.toString();
  }

  console.log('Redirecting to: ' + destinationURL);
  return Response.redirect(destinationURL, 303);
}

async function createNotionPage(body, env) {
  return fetch(`${env.API_PATH}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${env.NOTION_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
  })
  .then(res => res.json())
  .catch(err => {
    console.error(err);
    throw err;
  });
}

async function handleFormSubmit(rr, i, d, tz, asn, country_code, accel, touch, display, ua, env) {
  try {
    const requestBody = {
      parent: {
        database_id: env.DB2_ID,
      },
      properties: {
        Display: { title: [{ text: { content: display } }] },
        Touch: { rich_text: [{ text: { content: touch } }] },
        Lang: { rich_text: [{ text: { content: country_code } }] },
        TZ: { rich_text: [{ text: { content: tz } }] },
        "FDB type": { rich_text: [{ text: { content: String(asn) } }] },
        Messaga: { rich_text: [{ text: { content: d } }] },
        Location: { rich_text: [{ text: { content: rr } }] },
        IP: { rich_text: [{ text: { content: i } }] },
        Accel: { rich_text: [{ text: { content: accel } }] },
        UA: { rich_text: [{ text: { content: ua } }] },
      },
    };
    await createNotionPage(requestBody, env);
    console.info(JSON.stringify(requestBody));
  } catch (error) {
    console.error('Error handling form submit:', error);
  }
}
