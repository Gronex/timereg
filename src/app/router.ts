import { html } from "lit-html";
import "./components/TimeregList";
import { Route } from "./Route";

export class Router {
  static current : Router;

  /**
   *
   */
  constructor() {
    Router.current = this;

    this.routes = this.initRouteMap();
  }

  private routes : Route[];

  initRouteMap() : Route[] {
    return [{
      pattern: /^\/?$/,
      content: html`<timereg-list></timereg-list>`
    }]
  }

  renderRoute() {
    return this.routes[0].content
  }

}
