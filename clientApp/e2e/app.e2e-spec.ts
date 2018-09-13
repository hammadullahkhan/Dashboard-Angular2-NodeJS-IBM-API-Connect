import { ApplicationHomePage } from './app.po';

describe('Application', function() {
    let page: ApplicationHomePage;

    beforeEach(() => {
        page = new ApplicationHomePage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('ERICSSON REVENUE MANAGER');
    });
});
