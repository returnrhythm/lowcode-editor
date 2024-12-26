import React, { MouseEventHandler, useState } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components";
import HoverMask from "../HoverMask";
import SelectedMask from "../SelectedMask";

export function EditArea() {
  const { components, curComponentId, setCurComponentId } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.dev) {
        return null;
      }

      return React.createElement(
        config.dev,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      );
    });
  }

  const [hoverComponentId, setHoverComponentId] = useState<number>();

  const handleMouseOver: MouseEventHandler = (e) => {
    const target = (e.target as HTMLElement).closest("[data-component-id]");
    if (target) {
      const componentId = target.getAttribute("data-component-id");
      if (componentId) {
        setHoverComponentId(Number(componentId));
      }
    }
  };

  const handleClick: MouseEventHandler = (e) => {
    const target = (e.target as HTMLElement).closest("[data-component-id]");
    if (target) {
      const componentId = target.getAttribute("data-component-id");
      if (componentId) {
        setCurComponentId(+componentId);
      }
    }
  };

  return (
    <div
      className="h-[100%] edit-area"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => {
        setHoverComponentId(undefined);
      }}
      onClick={handleClick}
    >
      {renderComponents(components)}
      {hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask
          containerClassName="edit-area"
          componentId={hoverComponentId}
        />
      )}
      {curComponentId && (
        <SelectedMask
          containerClassName="edit-area"
          componentId={curComponentId}
        />
      )}
    </div>
  );
}
