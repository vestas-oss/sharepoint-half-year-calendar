import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../../../assets/dist/tailwind.css';
import { HalfYearCalendarComponent } from './HalfYearCalendarComponent';
import { Properties } from "../../types/Properties";
import { SPComponentLoader } from "@microsoft/sp-loader";

export default class HalfYearCalendarWebPart extends BaseClientSideWebPart<Properties> {
  public render(): void {
    const element = React.createElement(
      HalfYearCalendarComponent,
      {
        context: this.context,
        displayMode: this.displayMode,
        properties: this.properties,
        spfx: {
          components: SPComponentLoader,
          graph: this.context.msGraphClientFactory,
        },
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Setup the webpart in the main editor."
          },
          groups: [
          ]
        }
      ]
    };
  }
}
