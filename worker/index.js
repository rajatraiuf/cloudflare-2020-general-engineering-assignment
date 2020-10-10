// Global links list
let links = [
  { "name": "Resume Site", "url": "https://rajatrai101.github.io/" },
  { "name": "LinkedIn", "url": "https://linkedin.com/in/rajat-rai-519a3810b/" },
  { "name": "CloudFare", "url": "https://www.cloudflare.com/" }
];

//Main Request Handler
addEventListener('fetch', event => {
  event.respondWith(new Promise((resolve, reject) => {
    //extract URL from request
    let url = new URL(event.request.url);

    if (url.pathname === "/links") 
      resolve(handleJSONResponse(event.request));
    else
      fetch('https://static-links-page.signalnerve.workers.dev')
      .then((result) => {
        resolve(handleHTMLResponse(event.request, result));
      });
  }));
})

//JSON Request Handler
async function handleJSONResponse(request) {
  return new Response(JSON.stringify(links), {
    headers: { 'Content-Type': 'application/json' }
  });
}

//HTML Request Handler
async function handleHTMLResponse(request, page) {
  return new Promise((resolve, reject) => {
    // Rewriting HTML page
    let modPage = new HTMLRewriter()
    .on('div#links', new LinksTransformer(links))
    .on('div#profile', { element: (element) => {
      element.removeAttribute('style');
    }})
    .on('img#avatar', { element: (element) => {
      element.setAttribute('src', 'https://rajatrai101.github.io/images/profilepic.jpg');
    }})
    .on('h1#name', { element: (element) => {
      element.setInnerContent("Rajat Rai");
    }})
    .on('title', { element: element => {
      element.setInnerContent("Rajat Rai");
    }})
    .on('div#social', new SocialTransformer())
    .on('body', { element: element => {
      element.setAttribute("class", "bg-blue-700");
    }})
    .transform(page);
    resolve(modPage);
  });
}

//Social Links transformer
class LinksTransformer {
  constructor(links) {
    this.links = links;
  }

  async element(element) {
    this.links.forEach((link) => {
      element.append(`<a href="${link.url}" target="_blank">${link.name}</a>`,{ html: true });
    });
  }
}

//Social Links transformer
class SocialTransformer {
  constructor() {
    this.socials = [
      { url: "https://linkedin.com/in/rajat-rai-519a3810b/", icon: "https://simpleicons.org/icons/linkedin.svg" },
      { url: "mailto:rajatrai@ufl.edu", icon: "https://simpleicons.org/icons/gmail.svg" },
      { url: "https://github.com/rajatraiuf", icon: "https://simpleicons.org/icons/github.svg" }
    ];
  }

  async element(element) {
    element.removeAttribute('style');
    this.socials.forEach((social) => {
      element.append(`<a href="${social.url}" target="_blank"><img src="${social.icon}"/></a>`,{ html: true });
    });
  }
}