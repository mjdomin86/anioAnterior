export const environment = {
   production: false,

   domain_front: 'http://localhost:4200',
   domain_back: 'http://localhost:5000',
   recaptcha: '6LcjhzUUAAAAAP3eeFePBpOSSCeQoQ1lDwH8QHcN',
   GOOGLE_API_KEY: 'AIzaSyDUj0NuPPUfMrBNDBglkeeZy4oo9x6cR_8',
   provider_config: {
      'accessTokenUri': '/api/private/providers',
      'redirectURI': '/providers',
      "MP": {
         'href': 'https://auth.mercadopago.com.ar/authorization?client_id=5532061874310277&response_type=code&platform_id=mp&redirect_uri=http://localhost:4200/providers'
      },
      "BBVA": {
         'href': 'https://connect.bbva.com/sandboxconnect?client_id=app.bbva.ristreto&response_type=code&redirect_uri=http://localhost:4200/providers'
      }
   }
}

