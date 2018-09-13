import { BreadcrumbItem } from '@ericsson/oden/core';

export class BreadcrumbService {

    /**
     * Returns an array of  breadcrumb items.
     *
     * @returns {{
     *     [array]: BreadcrumbItem
     * }}
     */
    static getBreadcrumbData() {
       return [
            new BreadcrumbItem({ id: 0,  title: 'RM Newman', path: '/dashboard/report/RM_Newman' }),
            new BreadcrumbItem({ id: 1,  title: 'ECM Newman', path: '/dashboard/report/ECM_Newman' }),
            new BreadcrumbItem({ id: 2,  title: 'Protractor', path: '/dashboard/report/Protractor_Results' }),
            new BreadcrumbItem({ id: 3,  title: 'Unit Test', path: '/dashboard/report/Unit_Test' })
        ];
    }
}
