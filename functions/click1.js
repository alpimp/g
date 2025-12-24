export async function onRequest(context) {
  const { request, env } = context;
  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('Error parsing form ', error);
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
    'link1': 'https://134l.com/link?z=10316249', 
    'link2': 'https://ovret.com/link?z=10252578', 
    'link3': 'https://www.hundtoller.top/f/30225bd3-f94b-4e75-8af9-565e557fa224', 
    'link4': 'https://www.hundtoller.top/f/0cd6772a-7986-4a33-88cc-f0e22079470a', 
    'link5': 'https://www.hundtoller.top/f/5d465e4a-c885-4145-931b-ad2202163e9e', 
    'link6': 'https://github.com', 
    'link7': 'https://stackoverflow.com', 
    'link8': 'https://news.ycombinator.com', 
    'link9': 'https://18dbne.mcgo2.com/click', 
    'link10': 'https://3ye4x.bemobtrcks.com/click' 
  };
  // Check for 'link' parameter in query string
  const linkParam = pparams.get('link');
  if (linkParam && linkMap.hasOwnProperty(linkParam)) {
    destinationURL = linkMap[linkParam];
    pparams.delete('link'); // Remove internal routing param before redirect
  }
  // ====== CLEAN PARAMETER MAPPING SYSTEM ======
  // Define source parameter sets
  const s1_params = ['click_id', 'source_id', 'sub_source_id', 'isp'];
  const s2_params = ['pId', 'custom1', 'custom2', 'custom3'];
  const s3_params = ['click_Id', 't1', 't2', 't3'];
  // Define destination parameter sets
  const d1_params = ['ymid', 'var', 'sub_1', 'sub_2'];
  const d2_params = ['clId', 'sub1', 'sub2', 'sub3'];
  const d3_params = ['clickid', 'sub_1', 'sub_2', 'sub_3'];
  // Get source and destination types from URL parameters
  const sourceType = pparams.get('src') || 's1';
  const destType = pparams.get('dst') || 'd1';
  // Create mapping based on source and destination types
  const paramMapping = {};
  let sourceParams = [];
  let destParams = [];
  // Select source parameter set
  switch(sourceType) {
    case 's1': sourceParams = s1_params; break;
    case 's2': sourceParams = s2_params; break;
    case 's3': sourceParams = s3_params; break;
    default: sourceParams = s1_params;
  }
  // Select destination parameter set
  switch(destType) {
    case 'd1': destParams = d1_params; break;
    case 'd2': destParams = d2_params; break;
    case 'd3': destParams = d3_params; break;
    default: destParams = d1_params;
  }
  // Create mapping by position
  for(let i = 0; i < Math.min(sourceParams.length, destParams.length); i++) {
    paramMapping[sourceParams[i]] = destParams[i];
  }
  // Transform parameters according to mapping
  const transformedParams = new URLSearchParams();
  for (const [key, value] of pparams.entries()) {
    // Skip internal parameters used for routing/mapping
    if (['src', 'dst', 'link'].includes(key)) continue;
    // Apply mapping if defined, otherwise keep original parameter name
    const newKey = paramMapping[key] || key;
    transformedParams.append(newKey, value);
  }
  
  // ====== MERGE PARAMETERS WHILE PRESERVING EXISTING DESTINATION PARAMS ======
  // Parse destination URL to access its existing parameters
  const destUrl = new URL(destinationURL);
  
  // Get existing parameters from destination URL
  const existingParams = new URLSearchParams(destUrl.search);
  
  // Merge transformed parameters with existing destination parameters
  // (new parameters override existing ones if names collide)
  for (const [key, value] of transformedParams.entries()) {
    existingParams.set(key, value);
  }
  
  // Reconstruct destination URL with merged parameters
  destUrl.search = existingParams.toString();
  destinationURL = destUrl.toString();
  // ====== END PARAMETER MERGING SYSTEM ======
  
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
