/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components";
import { message } from "antd";

export function Preview() {
  const { components } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();
  const componentRefs = useRef<Record<string, any>>({});

  const handleEventName = (action: any, component: any, ...args: any[]) => {
    switch (action.type) {
      case "goToLink":
        if (action.url) {
          window.location.href = action.url;
        }
        break;
      case "showMessage":
        if (action.config) {
          if (action.config.type === "success") {
            message.success(action.config.text);
          } else if (action.config.type === "error") {
            message.error(action.config.text);
          }
        }
        break;
      case "customJS":
        if (action.code) {
          const func = new Function("context", "args", action.code);
          func(
            {
              name: component.name,
              props: component.props,
              showMessage(content: string) {
                message.success(content);
              },
            },
            args
          );
        }
        break;
      case "componentMethod":
        if (action.config) {
          const component = componentRefs.current[action.config.componentId];
          if (component) {
            component[action.config.method]?.(args);
          }
        }
    }
  };
  function handleEvent(component: Component) {
    const props: Record<string, any> = {};
    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name];
      if (eventConfig) {
        const { actions } = eventConfig;
        props[event.name] = (...args: any[]) => {
          actions.forEach((action: any) => {
            handleEventName(action, component, args);
          });
        };
      }
    });
    return props;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.prod) {
        return null;
      }

      return React.createElement(
        config.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ref:
            config.prod.$$typeof === Symbol.for("react.forward_ref")
              ? (ref: Record<string, any>) => {
                  componentRefs.current[component.id] = ref;
                }
              : undefined,
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || [])
      );
    });
  }

  return <div>{renderComponents(components)}</div>;
}
