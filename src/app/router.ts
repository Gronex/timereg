import { TemplateResult } from "lit-html";
import "./components/DayList";

export class Router {
  static current : Router;

  private state?: RouterState;
  private routes : Route[];

  constructor(private globalCallback?: () => void) {
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

  public onNavigate(event : MouseEvent, target : string) {
    event.preventDefault();
    this.navigate(target);
  }

  public navigate(location: string) {
    const state = this.resolveState(location);
    if (state) {
      window.history.pushState(null, state?.name ?? '', state?.path);
      this.doRouting();
      return true;
    }
    console.debug('navigation mismatch to: ', location);
    return false;
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

  private resolveState(fragment?: string) {
    fragment = fragment ?? this.getFragment();
    if (fragment === this.state?.path) {
      return;
    }

    let newState: RouterState | undefined;
    this.routes.some(route => {
      const match = fragment?.match(`^${route.path}$`);
      if (match) {
        match.shift();
        newState = {
          outlet: route.callback.apply({}, match),
          path: fragment,
          name: route.name
        }
        return match;
      }
      return false;
    });

    return newState;
  }

  private doRouting() {
    const state = this.resolveState();

    if(state){
      this.state = state;
      this.globalCallback?.();
    }
  }

  public get outlet() {
    return this.state?.outlet;
  }

}

export interface Route {
  path: string;
  callback: (...args: RegExpMatchArray) => TemplateResult,
  name: string
}

interface RouterState {
  path?: string,
  outlet?: TemplateResult,
  name?: string
}
