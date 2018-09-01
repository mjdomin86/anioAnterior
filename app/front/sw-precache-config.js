module.exports = {
    staticFileGlobs: [
        'dist/**.html',
        'dist/**.js',
        'dist/**.css',
        'dist/assets/images/*',
        'dist/assets/favicons/*',
        'dist/assets/i18n/*',
        'dist/fontawesome**'
        ],
    root: 'dist/',
    stripPrefix: 'dist',
    navigateFallback: '/index.html',
    runtimeCaching: [{
        urlPattern: /ec2-18-231-81-16.sa-east-1.compute.amazonaws.com\/api/,
        handler: 'networkFirst'
    }]
};