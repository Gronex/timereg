import { TemplateResult } from "lit-html";
import "./components/DayList";

export class Router {
  static current : Router;

  private state?: RouterState;
  private routes : Route[];

  constructor() {
    Router.current = this;

    this.routes = [];
  }

  public startRouting() {
    this.doRouting();
    this.listen();
  }


  public add(route : Route) : Router {
    this.routes.push(route);
    return this;
  }

  private getFragment() {
    return decodeURI(window.location.pathname + window.location.search)
      .replace(/\?(.*)$/, '')
      //.replace(/\/$/, '')
      //.replace(/^\//, '');
  }

  private listen() {
    window.addEventListener('popstate', this.doRouting.bind(this));
  }

  private doRouting() {
    const fragment = this.getFragment();
    if (fragment === this.state) {
      return;
    }

    this.routes.some(route => {
      const match = fragment.match(`^${route.path}$`)
      if (match) {
        match.shift();
        this.state = {
          outlet: route.callback.apply({}, match),
          path: fragment
        }
        return match;
      }
      return false;
    });
  }

  public get outlet() {
    return this.state?.outlet;
  }

}

export interface Route {
  path: string;
  callback: (...args: RegExpMatchArray) => TemplateResult
}

interface RouterState {
  path?: string,
  outlet?: TemplateResult
}
