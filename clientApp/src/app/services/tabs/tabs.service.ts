import { TabsItem } from '../../models/tabs/tabs-item.model';

/**
 * Mocking service for setting some tabs for the demo app
 */
export class TabsService {
    /**
     * Returns an array of mocked up tabs items.
     *
     * @returns {{
     *     [array]: TabsItem
     * }}
     */
    static getTabsData() {
        return  [
            new TabsItem(0, 'RM Newman', '/dashboard/report/RM_Newman'),
            new TabsItem(1, 'ECM Newman', '/dashboard/report/ECM_Newman'),
            new TabsItem(2, 'Protractor', '/dashboard/report/Protractor_Results'),
            new TabsItem(3, 'Unit Test', '/dashboard/report/Unit_Test')
        ];
    }
}
