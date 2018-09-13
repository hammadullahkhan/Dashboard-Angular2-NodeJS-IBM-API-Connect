System.config({
    packages: {
        'dashboard': { defaultExtension: 'js' }
    },
    bundles: {
        '/dashboardgui/dashboard.js': ['dashboard/*']
    }
});