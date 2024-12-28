import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import CookiesService from 'ember-cookies/services/cookies';

type Cookie = { name: string; value?: string };

export default class IndexController extends Controller {
  @service cookies!: CookiesService;

  get allCookies(): Cookie[] {
    this.cookies.write('now', new Date().getTime());

    const cookies = this.cookies.read();
    return Object.keys(cookies).reduce((acc, key) => {
      let value = cookies[key];
      acc.push({ name: key, value });

      return acc;
    }, [] as Cookie[]);
  }

  get singleCookie(): Cookie {
    const cookie = this.cookies.read('now');
    return { name: 'now', value: cookie };
  }
}
