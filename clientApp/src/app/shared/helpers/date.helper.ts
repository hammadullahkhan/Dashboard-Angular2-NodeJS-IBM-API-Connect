export class DateHelper {
    private static formatDate(date: string): string {
        return date.replace(/-/g, '/');
    }

    public static getFormatedDate(date: Date): string {
        let dtString = '\'' + date + '\''.toString();
        let dt = new Date(dtString);

        if ( !isNaN(dt.getTime()) ) {
            let newDate = dt.toISOString().substring(0, 10);
            let time = dt.toISOString().substring(11, 19);
            return this.formatDate(newDate + ' ' + time);
        } else {
            let splitDt = dtString.split('/')[0].split('T');
            let newDate = splitDt[0].replace('\'', '');
            let time = splitDt[1].split('+')[0];
            return this.formatDate(newDate + ' ' + time);
        }
    }


    public static getDateFormats(date: string) {
        let formatedDate = date.replace(/\//g, '-').split('-');
        if ( formatedDate[1].length === 1 ) { formatedDate[1] =  '0' + formatedDate[1]; }
        if ( formatedDate[2].length === 1 ) { formatedDate[2] =  '0' + formatedDate[2]; }
        let formattedDate = formatedDate.join('-');
        let dtISOString;
         if ( formatedDate[2].indexOf('T') !== -1 ) {
              dtISOString = new Date(formatedDate.join('-')).toISOString();
         } else {
            let tzoffset = (new Date(formattedDate)).getTimezoneOffset() * 60000; // offset in milliseconds
             dtISOString = ( new Date( new Date(formattedDate).getTime() - tzoffset ) )
                .toISOString()
                .slice(0, -1);
            }
        // var dtISOString = new Date(formatedDate.join('-')).toISOString();

        let dtToks = dtISOString.split('T');
        let dateToks = dtToks[0].split('-');
        let timeToks = dtToks[1].split(':');
        let tzToks = timeToks[2].split('.');
        let second = tzToks[0];
        let timezone = tzToks[1];
        return {
            year: dateToks[0],
            month: dateToks[1],
            day: dateToks[2],
            hour: timeToks[0],
            minute: timeToks[1],
            second: second,
            timezone: timezone
        };
    }

    public static getDateOnly(date: string) {
        let d = this.getDateFormats(date);
        return [d.year, d.month, d.day].join('/');
    }

    public static getDateTime(date: string) {
        let d = this.getDateFormats(date);
        return [ d.year, d.month, d.day ].join('/') + ' ' + [ d.hour, d.minute, d.second ].join(':');
    }

    public static getUTCDateTime(date: Date): string {
        let tzoffset = (new Date(date)).getTimezoneOffset() * 60000,
            dtISOString = ( new Date( new Date(date).getTime() - tzoffset ) )
            .toISOString();
        return dtISOString;
    }
}
