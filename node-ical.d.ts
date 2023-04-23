import { BaseComponent } from "node-ical";

declare module "node-ical" {
  export interface VEvent extends BaseComponent {
    attach: Attachement;
  }

  export interface Attachement {
    params: {
      FILENAME: string;
      FMTTYPE: string; // some RFC MIME types
    };
    val: string;
  }
}
