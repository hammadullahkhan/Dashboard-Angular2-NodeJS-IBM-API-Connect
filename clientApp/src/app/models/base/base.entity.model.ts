
import { DateHelper } from '../../shared/helpers/index';

export class BaseEntityModel {

    lastModified?: string;

    setLastModified(val: any) {
        if ( val['lastModified'] !== undefined &&  val['lastModified'] !== '' ) {
            this.lastModified = DateHelper.getDateTime(val['lastModified']);
        }
    }
}
