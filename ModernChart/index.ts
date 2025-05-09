// index.ts
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { Chart } from "./Chart/Chart";
import * as React from "react";
import "./styles/globals.scss"

export class ModernChart implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private notifyOutputChanged!: () => void;

  init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void
  ): void {
    console.log("Modern Chart 0.1 Initialised")
    this.notifyOutputChanged = notifyOutputChanged;
  }

  updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
    return React.createElement(Chart, {
      context,
      notifyOutputChanged: this.notifyOutputChanged
    });
  }

  getOutputs(): IOutputs { return {}; }
  destroy(): void { /* no-op */ }
}
