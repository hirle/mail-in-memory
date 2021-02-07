import { Mail } from '@mail-in-memory/model'
import { DateTime, Duration } from 'luxon';

function checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      // 204 has - by definition - no content, so JSON.parse would fail
      return response.status === 204 ? Promise.resolve(null) : response.json();
    } else {
        return response.text().then(body => {
            throw new Error(`Bad response from server ${response.status} ${body}`);
        });
    }
}

const JSON_MIME_TYPE = 'application/json';

const defaultOptions: RequestInit = {
    headers: {
        Accept: JSON_MIME_TYPE
    }
};

export function GetLastEmails(count: number): Promise<Mail[]> {
    return fetchMails( `/api/mails/latest?count=${count.toString()}` ); 
}

export function GetEmailsFor(duration: Duration ): Promise<Mail[]> {
    return fetchMails( `/api/mails/for/${duration.toISO()}` ); 
}

export function GetEmailsSince(date: DateTime ): Promise<Mail[]> {
    return fetchMails( `/api/mails/since/${date.toISO()}` ); 
}

function fetchMails(path: string) : Promise<Mail[]>{
    return fetch(path, defaultOptions).then(checkStatus)
        .then(responseJson => {
            if( Array.isArray(responseJson) ) {
                return responseJson.map( elt => Mail.create(elt));
            } else {
                throw new Error('Expected an array, got ' + responseJson.toString())
            }
        });
}

