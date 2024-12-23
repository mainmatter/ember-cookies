import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

type Cookie = { name: string; value: any };

export default class IndexController extends Controller {
  @service cookies!: any;

  get allCookies(): Cookie[] {
    this.cookies.write('now', new Date().getTime());

    const cookies = this.cookies.read();
    return Object.keys(cookies).reduce((acc, key) => {
      let value = cookies[key];
      acc.push({ name: key, value });

      return acc;
    }, [] as Cookie[]);
  }
}
