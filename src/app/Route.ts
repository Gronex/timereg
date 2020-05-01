import { TemplateResult } from "lit-element";

export interface Route {
  pattern: RegExp;
  content: TemplateResult
}
