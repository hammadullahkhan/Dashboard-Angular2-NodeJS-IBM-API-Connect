import { TabsItemInterface } from '@ericsson/oden/core/interfaces';

export class TabsItem implements TabsItemInterface {
    constructor( public id: number, public title: string, public path: string) {}
}
